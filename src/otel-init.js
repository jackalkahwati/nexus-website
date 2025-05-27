'use strict'

const opentelemetry = require('@opentelemetry/api');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { NetInstrumentation } = require('@opentelemetry/instrumentation-net');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Service name can be set via environment variable
const serviceNamePrefix = process.env.OTEL_SERVICE_NAME_PREFIX || 'nexus-';
const serviceName = process.env.OTEL_SERVICE_NAME || `${serviceNamePrefix}website`;

// Create the exporter
const otlpExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
});

// SDK initialization
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'production',
  }),
  traceExporter: otlpExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new NetInstrumentation(),
  ],
});

// Start the OpenTelemetry SDK
try {
  sdk.start();
  console.log(`OpenTelemetry initialized for service: ${serviceName}`);
  console.log(`Sending telemetry to: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'}`);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('OpenTelemetry SDK shut down successfully.'))
      .catch((error) => console.error('Error shutting down OpenTelemetry SDK:', error))
      .finally(() => process.exit(0));
  });
} catch (error) {
  console.error('Error initializing OpenTelemetry:', error);
}

module.exports = sdk; 