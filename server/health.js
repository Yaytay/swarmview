var http = require('http');

var options = {
    host: 'localhost',
    port: 5173,
    path: '/health'
  };
var req = http.get(options, function(response) {
  // handle the response
  var res_data = '';
  response.on('data', function(chunk) {
    res_data += chunk;
  });
  response.on('end', function() {
    console.log(res_data);
    process.exit(0);
  });
});
req.on('error', function(err) {
  console.log("Request error: " + err.message);
  process.exit(1);
});