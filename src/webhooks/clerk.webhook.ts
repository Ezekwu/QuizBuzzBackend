import { Webhook } from 'svix';
import { Response, Request } from 'express';
import { CLERK_WEBHOOK_SIGNING_SECRET } from '../common/privateKeys.js';
import UserModel from '../data/user/UserModel.js';
import { extractClerkUserName, ClerkUserMetadata } from '../utils/clerk.utils.js';

interface ClerkUserEventData {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  unsafe_metadata: ClerkUserMetadata;
}

interface ClerkWebhookEvent {
  data: ClerkUserEventData;
  type: string;
}

export default async function clerkWebhook(req: Request, res: Response) {
  const WEBHOOK_SECRET = CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SIGNING_SECRET');
    return res.status(500).send('Webhook secret not configured');
  }

  // Get the headers
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send('Error occurred -- no svix headers');
  }

  // Get the body
  const body = req.body.toString('utf8');

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkWebhookEvent;

  // Attempt to verify the incoming webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).send('Error verifying webhook');
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name, unsafe_metadata } = evt.data;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error('No email address found in Clerk event');
      return res.status(400).send('No email address found');
    }


    const userName = extractClerkUserName(
      unsafe_metadata,
      username,
      first_name,
      last_name,
      email
    );

    try {
      if (eventType === 'user.created') {
        const existingUser = await UserModel.findOne({ clerkUserId: id });
        if (!existingUser) {
          await UserModel.create({
            clerkUserId: id,
            email,
            userName,
          });
          console.log(`User ${id} created in database with username: ${userName}`);
        } else {
          console.log(`User ${id} already exists, skipping creation`);
        }
      } else if (eventType === 'user.updated') {
        await UserModel.findOneAndUpdate(
          { clerkUserId: id },
          {
            email,
            userName,
          },
          { upsert: true, new: true }
        );
        console.log(`User ${id} updated in database with username: ${userName}`);
      }
    } catch (dbError) {
      console.error('Database error during user sync:', dbError);
      return res.status(500).send('Internal Server Error');
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await UserModel.deleteOne({ clerkUserId: id });
      console.log(`User ${id} deleted from database`);
    } catch (dbError) {
      console.error('Database error during user deletion:', dbError);
      return res.status(500).send('Internal Server Error');
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Webhook processed successfully',
  });
}
