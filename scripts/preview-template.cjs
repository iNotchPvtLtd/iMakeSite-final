const express = require('express');
const path = require('path');
const open = require('open'); // This works with open@8
const net = require('net');

(async () => {
    const app = express();
    const startPort = process.argv[2] || 3005; // Use port from arguments or default to 3005
    const port = startPort;

    app.use(express.static(path.join(__dirname, 'output')));

    app.listen(port, () => {
        const url = `http://localhost:${port}`;
        console.log(`🚀 Template running at ${url}`);
        open(url); // This now works with open@8
    });
})();
