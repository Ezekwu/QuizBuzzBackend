export interface ClerkUserMetadata {
  userName?: string;
  [key: string]: any;
}

/**
 * Extracts a display name for a user from Clerk webhook data based on a priority order:
 * 1. userName from unsafe_metadata
 * 2. Clerk username
 * 3. Full name (first_name + last_name)
 * 4. Email prefix (part before @)
 * 5. Default 'Unknown User'
 */
export const extractClerkUserName = (
  unsafe_metadata: ClerkUserMetadata,
  username: string | null,
  first_name: string | null,
  last_name: string | null,
  email: string
): string => {
  return (
    unsafe_metadata?.userName ||
    username ||
    `${first_name || ''} ${last_name || ''}`.trim() ||
    email.split('@')[0] ||
    'Unknown User'
  );
};
