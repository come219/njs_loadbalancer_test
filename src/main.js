// nodejs loadbalancer test server
//sebistj, come219


const express = require('express');
const compression = require('compression');

const app = express();

const instanceId = process.env.INSTANCE_ID || 'unknown';

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add response compression
app.use(compression());

// Add routing
app.get('/', (req, res, next) => {
  try {
    const startTime = Date.now();
    const options = {
      host: 'www.google.com',
      port: 80,
      path: '/',
    };
    const httpReq = require('http').get(options, (httpRes) => {
      const responseTime = Date.now() - startTime;
      let rawData = '';
      httpRes.setEncoding('utf8');
      httpRes.on('data', (chunk) => {
        rawData += chunk;
      });
      httpRes.on('end', () => {
        try {
          const packetLoss = getPacketLoss(rawData);
          const message = `Hello, World! This request was served by instance ${instanceId}. Response time: ${responseTime}ms. Packet loss: ${packetLoss}.`;
          res.type('text/plain').send(message);
        } catch (err) {
          next(err);
        }
      });
    });
    httpReq.on('error', (err) => {
      next(err);
    });
  } catch (err) {
    next(err);
  }
});

// Add error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Function to calculate packet loss
function getPacketLoss(data) {
  // Dummy implementation for demonstration purposes
  const packetLoss = Math.random() > 0.5 ? 'N/A' : '10%';
  return packetLoss;
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

