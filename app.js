var http = require('http'),
    fs   = require('fs'),
    filePath = 'audio/ADC17605.mp3',
    stat = fs.statSync(filePath);

http.createServer(function(request, response) {

  response.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size
  });

  // We replaced all the event handlers with a simple call to util.pump()
  fs.createReadStream(filePath).pipe(response);
}).listen(8080);

console.log('Server is running...');