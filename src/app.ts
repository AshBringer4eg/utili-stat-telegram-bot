import 'dotenv/config';
import { init } from './bot';

import express, { Request, Response } from 'express';
import { handleCallback } from './integration/google/auth';
import chalk from 'chalk';


const app = express();
const port = 10000;

// Middleware to handle JSON requests
app.use(express.json());

// Define a simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});
// Define a simple route
app.get('/oauth2callback', (req: Request, res: Response) => {
  if (!req.query.code) {
    throw new Error("There is no Token. The token is required.");
  }
  handleCallback(req.query.code as string);
  res.send('Success! You can close this page.');
});

// Start the server
app.listen(port, () => {
  const bot = init();

  // await runMigrations();

  // dbmanager.sync();
  bot.startPolling();
  console.log(chalk.green(`Server running at http://localhost:${port}`));
});