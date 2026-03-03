import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js'
import webhookRoutes from './routes/webhook.routes.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(clerkMiddleware());

app.use(cors());

// Webhook routes - registered BEFORE express.json() to allow raw body handling
// We apply express.raw() to the specific routes that need it within the router or here
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Regular middleware for all other routes
app.use(express.json());

// API routes
app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('QuizBuzz API is running!');
});

export default app;
