var http = require('http');

var options = {
    host: 'localhost',
    port: 5173,
    path: '/health'
  };
var req = http.get(options, (response) => {
  // handle the response
  var res_data = '';
  response.on('data', (chunk) => {
    res_data += chunk;
  });
  response.on('end', () => {
    console.log(res_data);
    process.exit(0);
  });
});
req.on('error', (err) => {
  console.log("Request error: " + err.message);
  process.exit(1);
});