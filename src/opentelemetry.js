const { Resource } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const api = require('@opentelemetry/api');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { NodeTracerProvider, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { FetchInstrumentation } = require('opentelemetry-instrumentation-fetch-node');

const providerConfig = {
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'trace-sample-app',
  }),
};

const provider = new NodeTracerProvider(providerConfig);

let spanProcessor;
if (process.env['LOG_TARGET'] === 'gcp') {
  spanProcessor = new BatchSpanProcessor(new TraceExporter());
} else {
  api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.INFO);
  spanProcessor = new BatchSpanProcessor(new ConsoleSpanExporter());
}

provider.addSpanProcessor(spanProcessor);
provider.register();

registerInstrumentations({
  instrumentations: [
    new ExpressInstrumentation({
      ignoreLayersType: ['middleware']
    }),
    new HttpInstrumentation(),
    new FetchInstrumentation(),
  ],
});

// Attempt a clean shutdown.
// Unclear whether cloud functions actually send SIGTERM.
process.on('SIGTERM', async () => {
  await provider.shutdown();
});
