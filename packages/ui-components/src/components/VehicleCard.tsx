import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { formatCurrency } from '../utils';

export interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image?: string;
  currency?: string;
  location?: string;
  availability?: string;
  rating?: number;
  features?: string[];
  className?: string;
  onBookClick?: (id: string) => void;
  onViewDetailsClick?: (id: string) => void;
  whiteLabel?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    brandName?: string;
  };
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  make,
  model,
  year,
  price,
  image,
  currency = 'USD',
  location,
  availability,
  rating,
  features,
  className,
  onBookClick,
  onViewDetailsClick,
  whiteLabel,
}) => {
  const vehicleName = `${year} ${make} ${model}`;
  
  // Apply white label styling if provided
  const cardStyle = whiteLabel?.primaryColor 
    ? { borderColor: whiteLabel.primaryColor } 
    : {};
    
  const buttonStyle = whiteLabel?.primaryColor 
    ? { backgroundColor: whiteLabel.primaryColor } 
    : {};

  return (
    <Card className={className} style={cardStyle}>
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={vehicleName}
            className="h-full w-full object-cover"
          />
          {whiteLabel?.logoUrl && (
            <div className="absolute top-2 right-2 h-8 w-8">
              <img 
                src={whiteLabel.logoUrl} 
                alt={whiteLabel.brandName || 'Brand logo'} 
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{vehicleName}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {location && <p>{location}</p>}
          {availability && <p>Available: {availability}</p>}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-lg font-semibold">
          {formatCurrency(price, currency)}
        </div>
        
        {rating && (
          <div className="mt-2 flex items-center">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-500">{rating.toFixed(1)}</span>
          </div>
        )}
        
        {features && features.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onViewDetailsClick?.(id)}
        >
          View Details
        </Button>
        <Button
          style={buttonStyle}
          onClick={() => onBookClick?.(id)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};