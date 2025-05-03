const express = require('express');
const path = require('path');
const open = require('open'); // This works with open@8
const net = require('net');

function getAvailablePort(start = 3005) {
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
        const url = `http://localhost:${port}`;
        console.log(`🚀 Template running at ${url}`);
        open(url); // This now works with open@8
    });
})();
