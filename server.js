// server.js
const http = require('node:http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf8');

function sendFile(res, filePath, contentType = 'text/html') {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(500); return res.end('Server Error'); }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function serveStatic(req, res) {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, urlPath);

  // security check
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(400); return res.end('Bad Request');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
  }[ext] || 'application/octet-stream';

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) { res.writeHead(404); return res.end('Not Found'); }
    sendFile(res, filePath, mime);
  });
}

function readRequestBody(req, cb) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try { cb(null, JSON.parse(body || '{}')); }
    catch (e) { cb(new Error('Invalid JSON')); }
  });
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // API: Register
  if (req.method === 'POST' && req.url === '/api/register') {
    return readRequestBody(req, (err, body) => {
      if (err) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Invalid JSON' })); }
      const { name, email, password } = body;
      if (!email || !password) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Missing fields' })); }

      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      if (users.find(u => u.email === email)) {
        res.writeHead(409); return res.end(JSON.stringify({ error: 'User exists' }));
      }
      // NOTE: In production, hash passwords (bcrypt) and use a DB.
      users.push({ id: Date.now(), name: name || '', email, password });
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
  }

  // API: Login
  if (req.method === 'POST' && req.url === '/api/login') {
    return readRequestBody(req, (err, body) => {
      if (err) { res.writeHead(400); return res.end(JSON.stringify({ error: 'Invalid JSON' })); }
      const { email, password } = body;
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) { res.writeHead(401); return res.end(JSON.stringify({ error: 'Invalid credentials' })); }
      // In production return a JWT/session cookie
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, user: { id: user.id, name: user.name, email: user.email } }));
    });
  }

  // static
  serveStatic(req, res);
});

const PORT = 8001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
