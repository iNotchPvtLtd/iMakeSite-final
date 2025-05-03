// pages/api/dynamic-template.js
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { htmlContent } = req.body;

    const htmlPath = path.join(process.cwd(), 'scripts', 'output', 'index.html');
    fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
    fs.writeFileSync(htmlPath, htmlContent);

    const previewScript = path.join(process.cwd(), 'scripts', 'preview-template.cjs');
    exec(`node ${previewScript}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Exec error:', error);
        console.log('stderr',stderr)
        return res.status(500).json({ message: 'Execution failed', error: error.message });
      }
      res.status(200).json({ message: 'Preview launched', output: stdout });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
