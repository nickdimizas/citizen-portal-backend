import express, { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Express Typescript Backend!');
});

export default app;
