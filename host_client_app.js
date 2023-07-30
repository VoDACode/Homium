const express = require('express');
const createProxyMiddleware = require('http-proxy-middleware').createProxyMiddleware;
const fs = require('fs');
const path = require('path');

const app = express();

const options = {
    target: 'localhost:8080', // target host
    port: 80,
    dist: '/opt/homium/client-app/dist'
};

// parse parameters
process.argv.forEach((val, index) => {
    if (val === '--target') {
        options.target = process.argv[index + 1];
    }
    if (val === '--port') {
        options.port = parseInt(process.argv[index + 1]);
    }
    if (val === '--dist') {
        options.dist = process.argv[index + 1];
    }
});

// proxy /api to options.target + '/api'
app.use(createProxyMiddleware('/api', { target: `http://${options.target}`, changeOrigin: true }));
let apiWsProxy = createProxyMiddleware('/api', { target: `ws://${options.target}`, ws: true, changeOrigin: true });

app.use(createProxyMiddleware('/extensions', { target: `http://${options.target}`, changeOrigin: true }));
let extensionWsProxy = createProxyMiddleware('/extensions', { target: `ws://${options.target}`, ws: true, changeOrigin: true });

app.use(createProxyMiddleware('/extension-info', { target: `http://${options.target}`, changeOrigin: true }));

// add use for static files
app.use(express.static(options.dist));

// add use for SPA
app.use((req, res) => {
    if(fs.existsSync(path.join(options.dist, req.url))) {
        res.sendFile(path.join(options.dist, req.url));
    } else {
        res.sendFile(path.join(options.dist, 'index.html'));
    }
});


let server = app.listen(options.port, () => {
    console.log(`App listening at http://127.0.0.1:${options.port}`);
});

server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/api')) {
        apiWsProxy.upgrade(req, socket, head);
    } else if (req.url.startsWith('/extensions')) {
        extensionWsProxy.upgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});