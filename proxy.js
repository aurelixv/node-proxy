const http = require('http');
const url = require('url');

http.createServer((req, res) => {

  const { method, headers } = req;
  const reqUrl = url.parse(req.url);
  
  const options = {
    ...reqUrl,
    method: method,
    headers: headers,
  }

  if(JSON.stringify(options).includes('monitorando')) {
    console.log('\n\nMONITORANDO\n\n');
    res.writeHead(200);
    res.write('<h1>Acesso nao autorizado!</h1>');
    res.end();
  } else {
    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.on('data', (chunk) => {
        res.write(chunk);
      });
      proxyRes.on('end', () => {
        console.log('Client request: ' + req.url +
          '\nClient address: ' + req.connection.remoteAddress +  
          '\nIP do servidor web: ' + proxy.connection.remoteAddress + 
          '\nResponse code: ' + proxyRes.statusCode +
          '\n--------------------------------------------------------');
        res.end();
      });
    });
    proxy.on('error', (error) => {
      console.log('erro ' + error); 
    });
    proxy.end();
  }
}).listen(30000);
