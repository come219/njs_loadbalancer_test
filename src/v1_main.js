// nodejs simple server
// general testing load balancer and speed tests
// written by sebistj, come219
// created: 27/02/23
// last update: 27/02/23

const express = require('express');
const compression = require('compression');
const app = express();
const speedTest = require('fast-speedtest-api');

const instanceId = process.env.INSTANCE_ID || 'unknown';

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add response compression
app.use(compression());

// Add routing
app.get('/', async (req, res, next) => {
  try {
    const speed = await speedTest({ maxTime: 5000 });
    const responseTime = Date.now() - req.startTime;
    const packetLoss = speed.packetLoss || 'N/A';
    const message = `Hello, World! This request was served by instance ${instanceId}. Response time: ${responseTime}ms. Packet loss: ${packetLoss}.`;
    res.type('text/plain').send(message);
  } catch (err) {
    next(err);
  }
});

// Add error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Set start time for request
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

