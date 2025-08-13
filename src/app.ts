import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
const app: Application = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Citizen Portal API',
      version: '1.0.0',
      description: 'Minimal setup for API documentation',
    },
  },
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Express Typescript Backend!');
});

export default app;
