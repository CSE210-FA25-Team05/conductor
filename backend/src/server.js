const http = require('http');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API routes
    if (req.url === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }
    
    // 404
    res.writeHead(404);
    res.end('Not found');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

server.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
