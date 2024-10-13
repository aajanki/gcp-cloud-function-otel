const functions = require('@google-cloud/functions-framework');
const { Logging } = require('@google-cloud/logging');

const logging = new Logging();
void logging.setProjectId();

functions.http('otel', async (req, res) => {
  writeLog(`GET /otel called`);

  try {
    const wikires = await fetch('https://en.wikipedia.org/wiki/Main_Page');
    writeLog(`Wikipedia fetch status: ${wikires.status}`);
    const body = await wikires.text();

    res.send(`OK, ${body.length} characters`);
  } catch (err) {
    writeLog(String(err));
    res.status(500).send('Internal error');
  }
});

function writeLog(message) {
  const log = logging.log('app');
  const entry = log.entry({ severity: 'INFO' }, message);

  // fire-and-forget
  // Could also await to ensure that the log gets written
  void log.write(entry);
}
