const { exec } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, './../../.env.local') });

exec('node --experimental-json-modules seedWebTemplates.js', 
  { 
    cwd: __dirname,
    env: process.env  // Pass environment variables to child process
  }, 
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  }
);