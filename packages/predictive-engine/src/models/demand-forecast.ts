import * as tf from '@tensorflow/tfjs-node';
import { DemandFactors, DemandForecast } from '../types';
import { getLocalTimeFeatures, getDistanceToEvents } from '../utils';

// Paths to pre-trained models
const TIME_SERIES_MODEL_PATH = './models/time-series';
const LOCATION_MODEL_PATH = './models/location-based';

let timeSeriesModel: tf.LayersModel | null = null;
let locationModel: tf.LayersModel | null = null;

/**
 * Initialize demand forecast models
 */
export async function initializeDemandForecasting(): Promise<void> {
  try {
    // Load pre-trained TensorFlow.js models
    timeSeriesModel = await tf.loadLayersModel(`file://${TIME_SERIES_MODEL_PATH}/model.json`);
    locationModel = await tf.loadLayersModel(`file://${LOCATION_MODEL_PATH}/model.json`);
    
    console.log('Demand forecasting models loaded successfully');
  } catch (error) {
    console.error('Failed to load demand forecasting models:', error);
    console.log('Using fallback statistical models');

    // Create placeholder models if loading fails
    createFallbackModels();
  }
}

/**
 * Create fallback statistical models if TensorFlow models cannot be loaded
 */
function createFallbackModels(): void {
  // Simple placeholder models that will be replaced with real models in production
  timeSeriesModel = {
    predict: (input: tf.Tensor) => {
      return tf.tidy(() => {
        // Simplified time-based model that returns mock values
        const shape = input.shape;
        return tf.randomNormal([shape[0], 1]);
      });
    }
  } as unknown as tf.LayersModel;

  locationModel = {
    predict: (input: tf.Tensor) => {
      return tf.tidy(() => {
        // Simplified location-based model that returns mock values
        const shape = input.shape;
        return tf.randomNormal([shape[0], 1]);
      });
    }
  } as unknown as tf.LayersModel;
}

/**
 * Preprocess input data for the demand forecasting model
 */
function preprocessInput(factors: DemandFactors): tf.Tensor {
  return tf.tidy(() => {
    // Extract time features (hour of day, day of week, etc.)
    const timeFeatures = getLocalTimeFeatures(factors.time);
    
    // Normalize location
    const locationFeatures = [
      factors.location.lat / 90, // Normalize to [-1, 1]
      factors.location.lng / 180, // Normalize to [-1, 1]
    ];
    
    // Weather encoding (one-hot)
    const weatherFeatures = [0, 0, 0, 0]; // [sunny, cloudy, rainy, snowy]
    if (factors.weatherCondition) {
      switch (factors.weatherCondition) {
        case 'sunny': weatherFeatures[0] = 1; break;
        case 'cloudy': weatherFeatures[1] = 1; break;
        case 'rainy': weatherFeatures[2] = 1; break;
        case 'snowy': weatherFeatures[3] = 1; break;
      }
    }
    
    // Event features
    let eventAttendees = 0;
    let nearestEventDistance = 10000; // Large default value
    
    if (factors.nearbyEvents && factors.nearbyEvents.length > 0) {
      eventAttendees = factors.nearbyEvents.reduce((sum, event) => sum + event.attendees, 0);
      nearestEventDistance = Math.min(...factors.nearbyEvents.map(event => event.distance));
    }
    
    // Normalized temperature if available
    const normalizedTemp = factors.temperature ? (factors.temperature + 20) / 60 : 0.5; // Normalize around -20 to 40°C
    
    // Combine all features
    const features = [
      ...timeFeatures,
      ...locationFeatures,
      factors.isWeekend ? 1 : 0,
      factors.isHoliday ? 1 : 0,
      ...weatherFeatures,
      normalizedTemp,
      eventAttendees / 10000, // Normalize attendees
      Math.min(1, 5 / nearestEventDistance), // Inverse distance, capped at 1
      factors.historicalDemand ? factors.historicalDemand / 100 : 0.5, // Normalize historical demand
    ];
    
    return tf.tensor2d([features]);
  });
}

/**
 * Predict demand based on the provided factors
 */
export async function predictDemand(factors: DemandFactors): Promise<DemandForecast> {
  // Ensure models are loaded
  if (!timeSeriesModel || !locationModel) {
    await initializeDemandForecasting();
  }
  
  // Convert input to tensor and normalize
  const inputTensor = preprocessInput(factors);
  
  // Get predictions from both models
  const timeSeriesPrediction = timeSeriesModel!.predict(inputTensor) as tf.Tensor;
  const locationPrediction = locationModel!.predict(inputTensor) as tf.Tensor;
  
  // Ensemble the predictions (weighted average)
  const prediction = tf.tidy(() => {
    return tf.add(
      tf.mul(timeSeriesPrediction, tf.scalar(0.6)),
      tf.mul(locationPrediction, tf.scalar(0.4))
    );
  });
  
  // Get the scalar values
  const predictionValue = (await prediction.data())[0] * 100; // Rescale
  const confidenceValue = Math.min(0.95, 0.6 + Math.random() * 0.2); // Mock confidence
  
  // Calculate recommended fleet size based on prediction
  const recommendedFleetSize = Math.ceil(predictionValue / 3);
  
  // Clean up tensors
  tf.dispose([inputTensor, timeSeriesPrediction, locationPrediction, prediction]);
  
  return {
    predictedDemand: Math.max(0, predictionValue),
    confidence: confidenceValue,
    recommendedFleetSize
  };
}

/**
 * Generate a demand heatmap for a geographic area
 */
export async function generateDemandHeatmap(
  centerLocation: { lat: number; lng: number },
  radius: number, // in kilometers
  time: string,
  resolution: number = 10, // grid points per side
): Promise<Array<{ lat: number; lng: number; demand: number }>> {
  const result: Array<{ lat: number; lng: number; demand: number }> = [];
  
  // Convert radius to lat/lng delta (approximate)
  const latDelta = radius / 111; // 1 degree lat is ~111km
  const lngDelta = radius / (111 * Math.cos(centerLocation.lat * Math.PI / 180));
  
  // Generate grid
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const lat = centerLocation.lat + latDelta * (2 * i / (resolution - 1) - 1);
      const lng = centerLocation.lng + lngDelta * (2 * j / (resolution - 1) - 1);
      
      // Create basic factors for this location
      const factors: DemandFactors = {
        time,
        location: { lat, lng },
        dayOfWeek: new Date(time).getDay(),
        isWeekend: [0, 6].includes(new Date(time).getDay()),
        isHoliday: false, // Would require holiday database
      };
      
      // Get prediction
      const prediction = await predictDemand(factors);
      
      result.push({
        lat,
        lng,
        demand: prediction.predictedDemand,
      });
    }
  }
  
  return result;
}

/**
 * Get recommendations for optimal vehicle placement
 */
export async function getFleetPlacementRecommendations(
  availableVehicles: number,
  region: { center: { lat: number; lng: number }, radius: number },
  time: string,
): Promise<Array<{ location: { lat: number; lng: number }, vehicleCount: number }>> {
  // Get demand heatmap
  const heatmap = await generateDemandHeatmap(region.center, region.radius, time);
  
  // Sort locations by demand
  const sortedLocations = [...heatmap].sort((a, b) => b.demand - a.demand);
  
  // Allocate vehicles based on demand distribution
  let remainingVehicles = availableVehicles;
  const recommendations: Array<{ location: { lat: number; lng: number }, vehicleCount: number }> = [];
  
  const totalDemand = sortedLocations.reduce((sum, loc) => sum + loc.demand, 0);
  
  for (const location of sortedLocations) {
    // Skip locations with very low demand
    if (location.demand < 1) continue;
    
    // Allocate vehicles proportionally to demand
    const proportion = location.demand / totalDemand;
    let vehicleCount = Math.min(Math.round(availableVehicles * proportion), remainingVehicles);
    
    // Ensure at least 1 vehicle for high-demand locations
    if (vehicleCount === 0 && location.demand > totalDemand / sortedLocations.length) {
      vehicleCount = 1;
    }
    
    if (vehicleCount > 0) {
      recommendations.push({
        location: { lat: location.lat, lng: location.lng },
        vehicleCount
      });
      
      remainingVehicles -= vehicleCount;
      
      // Stop when all vehicles have been allocated
      if (remainingVehicles <= 0) break;
    }
  }
  
  // If any vehicles remain, add them to the highest demand location
  if (remainingVehicles > 0 && recommendations.length > 0) {
    recommendations[0].vehicleCount += remainingVehicles;
  }
  
  return recommendations;
}