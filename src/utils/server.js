const express = require('express');
const path = require('path');
const open = require('open');

function getAvailablePort(start = 3005) {
    const net = require('net');
    return new Promise((resolve) => {
        const port = start;
        const server = net.createServer();
        server.listen(port, () => {
            server.once('close', () => resolve(port));
            server.close();
        });
        server.on('error', () => resolve(getAvailablePort(port + 1)));
    });
}

(async () => {
    const app = express();
    const port = await getAvailablePort();

    app.use(express.static(path.join(__dirname, 'output')));

    app.listen(port, () => {
        console.log(`🚀 Template running at http://localhost:${port}`);
        open(`http://localhost:${port}`);
    });
})();
