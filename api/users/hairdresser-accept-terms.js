import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { hairdresserProfiles } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import Sentry from '../_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Hairdresser accepting terms...');
    
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
    
    // Update the hairdresser profile
    await db.update(hairdresserProfiles)
      .set({ hasAcceptedTerms })
      .where(eq(hairdresserProfiles.userId, userId));
    
    console.log('Hairdresser terms acceptance recorded');
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in hairdresser-accept-terms endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}