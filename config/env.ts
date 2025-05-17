export const env = {
  mapbox: {
    token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    style: 'mapbox://styles/mapbox/dark-v11',
    defaultCenter: [-122.4194, 37.7749], // San Francisco
    defaultZoom: 12,
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    version: '2024-11-20.acacia' as const,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE,
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  }
} as const

export type Env = typeof env
