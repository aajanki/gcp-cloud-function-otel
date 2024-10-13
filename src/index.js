const functions = require('@google-cloud/functions-framework');
const { Logging } = require('@google-cloud/logging');
const https = require('https');

const logging = new Logging();
logging.setProjectId();

functions.http('helloWorld', async (req, res) => {
  writeLog(`hello world called`);

  const request = https.get('https://en.wikipedia.org/wiki/Main_Page', (wikipediaRes) => {
    wikipediaRes.resume();

    writeLog(`GET Wikipedia status code: ${wikipediaRes.statusCode}`);

    res.send('OK');
  });

  request.on('error', (err) => {
    writeLog(`Error reading Wikipedia: ${err.message}`);

    res.status(500).send('Internal error');
  });
});

function writeLog(message) {
  const log = logging.log('app');
 
  const metadata = {
    severity: 'INFO',
  };

  const entry = log.entry(metadata, message);

  // fire-and-forget
  // Could also await to ensure that the log gets written
  void log.write(entry);
}
