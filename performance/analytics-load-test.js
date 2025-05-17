import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '3m', target: 50 }, // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'], // Error rate should be below 10%
  },
}

const BASE_URL = __ENV.API_URL || 'http://localhost:3000'

// Helper to generate random date within last 30 days
function getRandomDateRange() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const randomStart = new Date(
    thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  )
  return {
    startDate: randomStart.toISOString(),
    endDate: now.toISOString(),
  }
}

// Helper to generate random metrics
function getRandomMetrics() {
  const metrics = ['pageViews', 'activeUsers', 'conversions', 'revenue']
  const numMetrics = Math.floor(Math.random() * 3) + 1 // 1-3 metrics
  return metrics.sort(() => Math.random() - 0.5).slice(0, numMetrics)
}

export default function () {
  // Test group for metrics endpoint
  const metricsTests = {
    'get metrics': () => {
      const { startDate, endDate } = getRandomDateRange()
      const metrics = getRandomMetrics()
      
      const response = http.get(`${BASE_URL}/api/analytics/metrics`, {
        params: {
          startDate,
          endDate,
          metrics: metrics.join(','),
        },
      })
      
      const success = check(response, {
        'status is 200': (r) => r.status === 200,
        'has metrics data': (r) => r.json('metrics') !== undefined,
      })
      
      errorRate.add(!success)
      sleep(1)
    },
    
    'get real-time metrics': () => {
      const response = http.get(`${BASE_URL}/api/analytics/realtime`)
      
      const success = check(response, {
        'status is 200': (r) => r.status === 200,
        'has real-time data': (r) => r.json('metrics') !== undefined,
      })
      
      errorRate.add(!success)
      sleep(1)
    },
  }

  // Test group for tracking endpoint
  const trackingTests = {
    'track metric': () => {
      const payload = {
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        metricName: getRandomMetrics()[0],
        value: Math.floor(Math.random() * 100),
        dimensions: {
          page: '/home',
          device: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)],
        },
      }
      
      const response = http.post(
        `${BASE_URL}/api/analytics/track`,
        JSON.stringify(payload),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      
      const success = check(response, {
        'status is 200': (r) => r.status === 200,
      })
      
      errorRate.add(!success)
      sleep(0.1) // Shorter sleep for tracking calls
    },
  }

  // Test group for funnel analysis
  const funnelTests = {
    'get funnel metrics': () => {
      const { startDate, endDate } = getRandomDateRange()
      const steps = ['visit', 'signup', 'purchase']
      
      const response = http.get(`${BASE_URL}/api/analytics/funnel`, {
        params: {
          startDate,
          endDate,
          steps: steps.join(','),
        },
      })
      
      const success = check(response, {
        'status is 200': (r) => r.status === 200,
        'has funnel data': (r) => r.json('funnel') !== undefined,
      })
      
      errorRate.add(!success)
      sleep(1)
    },
  }

  // Randomly select and execute tests based on weighting
  const rand = Math.random()
  if (rand < 0.4) {
    // 40% chance of running metrics tests
    Object.values(metricsTests).forEach((fn) => fn())
  } else if (rand < 0.8) {
    // 40% chance of running tracking tests
    Object.values(trackingTests).forEach((fn) => fn())
  } else {
    // 20% chance of running funnel tests
    Object.values(funnelTests).forEach((fn) => fn())
  }
} 