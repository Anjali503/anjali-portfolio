const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const mime = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon' };
http.createServer((req,res)=>{
  const reqPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(root, reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, ''));
  if (!filePath.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); return res.end('Not Found'); }
      res.writeHead(200, {'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream'});
      res.end(data);
    });
  });
}).listen(3000, '127.0.0.1', ()=> console.log('Serving on http://127.0.0.1:3000'));
