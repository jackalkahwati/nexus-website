import { SharedArray } from 'k6/data'
import { Rate } from 'k6/metrics'

export const options = {
  scenarios: {
    // Load test
    load_test: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 50 },  // Ramp up
        { duration: '3m', target: 50 },  // Stay at peak
        { duration: '1m', target: 0 },   // Ramp down
      ],
      gracefulRampDown: '30s',
    },
    // Stress test
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },  // Ramp up to 100 users
        { duration: '5m', target: 100 },  // Stay at 100
        { duration: '2m', target: 200 },  // Ramp up to 200
        { duration: '5m', target: 200 },  // Stay at 200
        { duration: '2m', target: 0 },    // Ramp down
      ],
      gracefulRampDown: '30s',
    },
    // Spike test
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 500 },  // Quick ramp-up
        { duration: '1m', target: 500 },   // Stay at peak
        { duration: '10s', target: 0 },    // Quick ramp-down
      ],
    },
    // Soak test
    soak_test: {
      executor: 'constant-vus',
      vus: 30,
      duration: '12h',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],  // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],                  // Error rate should be below 1%
    http_reqs: ['rate>100'],                         // Should handle at least 100 RPS
  },
}

// Custom metrics
export const errorRate = new Rate('errors')

// Test data
export const users = new SharedArray('users', function() {
  return JSON.parse(open('./data/users.json'))
})

export const searchQueries = new SharedArray('searchQueries', function() {
  return JSON.parse(open('./data/search-queries.json'))
})

// Environment configuration
export const config = {
  baseUrl: __ENV.BASE_URL || 'http://localhost:3000',
  apiKey: __ENV.API_KEY || 'test-api-key',
  thinkTime: {
    min: 1,
    max: 5,
  },
  timeout: 120000,  // 2 minutes
}

// Helper functions
export function randomUser() {
  return users[Math.floor(Math.random() * users.length)]
}

export function randomSearchQuery() {
  return searchQueries[Math.floor(Math.random() * searchQueries.length)]
}

export function sleep(min, max) {
  const time = Math.floor(Math.random() * (max - min + 1) + min)
  return new Promise(resolve => setTimeout(resolve, time * 1000))
} 