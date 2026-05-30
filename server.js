const WebSocket = require('ws');
const http = require('http');

// Use your numerical Magmanodes IP and port
const TARGET_URL = 'ws://91.98.80.233:25972'; 

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Eaglercraft WSS Reverse Proxy is running!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    const target = new WebSocket(TARGET_URL);

    target.on('open', () => {
        ws.on('message', (message) => {
            if (target.readyState === WebSocket.OPEN) {
                target.send(message);
            }
        });
    });

    ws.on('message', (message) => {
        if (target.readyState === WebSocket.OPEN) {
            target.send(message);
        }
    });

    ws.on('close', () => target.close());
    target.on('close', () => ws.close());
    
    ws.on('error', (err) => console.error('WS Client Error:', err));
    target.on('error', (err) => console.error('WS Target Error:', err));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Proxy listening on port ${PORT}`);
});
