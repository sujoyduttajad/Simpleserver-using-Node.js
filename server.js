const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(1337, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:1337/');

//Array of mine types
let mimeTypes = {
	"html" : "text/html",
	"jpeg" : "image/jpeg",
	"jpg" : "image/jpeg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
};

//Create Server
http.createServer(function(req, res){
  let uri = url.parse(req.url).pathname;
  let fileName = path.join(process.cwd(), unescape(uri));
  console.log('Loading ' + uri);
  let stats;

  try{
     stats = fs.lstatSync(fileName);
  }catch(e){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 NOT FOUND\n');
    res.end();
    return;
  }
    if(stats.isFile()){
      //extname() -- is for the extension
      let mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
      res.writeHead(200, {'Content-type': mimeType});

      let fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res); 
    }
    else if(stats.isDirectory()){
      res.writeHead(302, {
        'Location': 'index.html'
      });
      res.end();
    }else{
      res.writeHead(500, {'Content-Type' : 'text/plain'});
      res.write('500 Internam error\n');
      res.end();
    }
}).listen(1337);