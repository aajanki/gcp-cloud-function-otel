# OpenTelemetry for GCP Cloud Functions sample

A sample showing how to instrument a GCP Cloud Function to record traces and export them to GCP Cloud Trace.

## Running

```sh
npm install
NODE_OPTIONS="--require ./src/opentelemetry.js" npm run start
```

By default, traces are printed to stdout. Define environment variable `LOG_TARGET=gcp` to export traces to GCP Cloud Trace.

In another terminal tab:

```sh
curl http://localhost:8080/helloWorld
```

## Deployment

```sh
./deploy.sh
```
