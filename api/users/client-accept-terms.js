import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { clientProfiles } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import Sentry from '../_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Client accepting terms...');
    
    // Authenticate the user
    const authUser = await authenticateUser(req);
    
    const { userId, hasAcceptedTerms } = req.body;
    
    // Ensure userId matches authenticated user
    if (userId !== authUser.id) {
      return res.status(403).json({ error: 'User ID mismatch' });
    }
    
    // Connect to the database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Check if the client profile already exists
    const existingProfile = await db.select()
      .from(clientProfiles)
      .where(eq(clientProfiles.userId, userId))
      .limit(1);
    
    if (existingProfile && existingProfile.length > 0) {
      // Update existing profile
      await db.update(clientProfiles)
        .set({ hasAcceptedTerms })
        .where(eq(clientProfiles.userId, userId));
    } else {
      // Insert new profile
      await db.insert(clientProfiles)
        .values({
          userId,
          hasAcceptedTerms
        });
    }
    
    console.log('Client terms acceptance recorded');
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in client-accept-terms endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}