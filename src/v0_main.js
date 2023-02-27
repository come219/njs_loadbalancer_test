// nodejs simple server
// general testing load balancer and speed tests
// written by sebistj, come219
// created: 27/02/23
// last update: 27/02/23

const http = require('http');

const server = http.createServer((req, res) => {
  const start = Date.now();
  res.writeHead(200, {'Content-Type': 'text/plain'});

  // Get the instance ID from the environment variable
  const instanceId = process.env.INSTANCE_ID || 'unknown';

  // Generate the response
  const responseMsg = `Hello, World! This request was served by instance ${instanceId}.`;
  res.end(responseMsg);

  // Log the response time
  const responseTime = Date.now() - start;
  console.log(`Request served in ${responseTime}ms by instance ${instanceId}.`);
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
