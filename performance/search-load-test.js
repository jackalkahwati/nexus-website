import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // Ramp up to 20 users
    { duration: '3m', target: 20 }, // Stay at 20 users
    { duration: '1m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    errors: ['rate<0.1'], // Error rate must be less than 10%
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'
const SEARCH_QUERIES = [
  'test',
  'documentation',
  'api',
  'guide',
  'tutorial',
  'example',
]

export default function () {
  // Randomly select a search query
  const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)]

  // Perform search request
  const searchResponse = http.get(`${BASE_URL}/api/search?query=${query}`)

  // Check if request was successful
  const success = check(searchResponse, {
    'status is 200': (r) => r.status === 200,
    'response has results': (r) => {
      const body = JSON.parse(r.body)
      return Array.isArray(body.results)
    },
  })

  if (!success) {
    errorRate.add(1)
  }

  // Random sleep between requests
  sleep(Math.random() * 3)
}

// Custom metrics setup
const customMetrics = {
  searchLatency: new Rate('search_latency'),
  searchErrors: new Rate('search_errors'),
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

// Helper function to format the text summary
function textSummary(data, options) {
  const { metrics, root_group } = data
  const { http_req_duration, iterations, errors } = metrics

  return `
Performance Test Summary
=======================
Total Iterations: ${iterations.count}
Error Rate: ${(errors.rate * 100).toFixed(2)}%

Response Time
------------
Median: ${(http_req_duration.values.med).toFixed(2)}ms
95th percentile: ${(http_req_duration.values['p(95)']).toFixed(2)}ms
Max: ${(http_req_duration.values.max).toFixed(2)}ms

Scenarios
---------
${root_group.name}
  ✓ ${root_group.checks.passes} checks passed
  ✗ ${root_group.checks.fails} checks failed
`
} 