import express from 'express';
import clerkWebhook from '../webhooks/clerk.webhook.js';

const router = express.Router();

// This will be mounted at /api/webhooks in app.ts
router.post('/clerk', clerkWebhook);

export default router;
