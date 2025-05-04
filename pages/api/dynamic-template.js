// pages/api/dynamic-template.js
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import net from 'net';

export default function handler(req, res) {
  console.log('API endpoint called');
  if (req.method === 'POST') {
    const { htmlContent, port } = req.body;

    const htmlPath = path.join(process.cwd(), 'scripts', 'output', 'index.html');
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, htmlContent);

    console.log('HTML file written to:', htmlPath);

    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error('Port is already in use:', port);
        return res.status(400).json({ message: 'Port is already in use' });
      }
    });

    server.once('listening', () => {
      server.close();
      const previewScript = path.join(process.cwd(), 'scripts', 'preview-template.cjs');
      exec(`node ${previewScript} ${port}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Exec error:', error);
          console.log('stderr',stderr)
          return res.status(500).json({ message: 'Execution failed', error: error.message });
        }
        res.status(200).json({ message: 'Preview launched', output: stdout });
      });
    });

    server.listen(port);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
