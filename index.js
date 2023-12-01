const { exec } = require('child_process');
const { performance } = require('perf_hooks');
const path = require('path');
const dotenv = require('dotenv');

const apps = [
  { name: "App1", path: "../herbie-derbie/index.js", envPath: "../herbie-derbie/.env" },
  // Add more applications as needed
];

const testFiles = ['input.txt', 'input-10x.txt'];

function runTest(app, file) {
  // Load the .env file for the app
  const envConfig = dotenv.config({ path: path.resolve(__dirname, app.envPath) });
  if (envConfig.error) {
    throw envConfig.error;
  }

  const start = performance.now();
  exec(`node ${app.path} inputs/${file}`, { env: { ...process.env, ...envConfig.parsed } }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    const duration = performance.now() - start;
    console.log(`App: ${app.name}, File: ${file}, Duration: ${duration}ms`);
  });
}

apps.forEach(app => {
  testFiles.forEach(file => {
    runTest(app, file);
  });
});
