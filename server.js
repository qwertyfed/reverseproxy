const WebSocket = require('ws');
const http = require('http');

// Use environment variables for port and remote IP
const PORT = process.env.PORT || 8080;
const PROXY_IP = process.env.PROXY_IP || '91.98.80.233';
const PROXY_PORT = process.env.PROXY_PORT || '25972';

// Create a simple HTTP server to handle health checks
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WSS Reverse Proxy is running!');
});

// Create WebSocket Server pointing to your Magmanodes numerical IP and port
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected.');
    
    // Connect to the actual Magmanodes server
    const target = new WebSocket(`ws://${PROXY_IP}:${PROXY_PORT}`);

    target.on('open', () => {
        console.log('Connected to Magmanodes server.');
    });

    ws.on('message', (message) => {
        if (target.readyState === WebSocket.OPEN) {
            target.send(message);
        }
    });

    target.on('message', (message) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });

    ws.on('close', () => target.close());
    target.on('close', () => ws.close());
    
    ws.on('error', (err) => console.error('WS Error:', err));
    target.on('error', (err) => console.error('Target Error:', err));
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
