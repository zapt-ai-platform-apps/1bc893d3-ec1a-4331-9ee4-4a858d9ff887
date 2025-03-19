import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { users } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import Sentry from '../_sentry.js';

export default async function handler(req, res) {
  try {
    console.log('Loading user profile...');
    
    // Authenticate the user
    const authUser = await authenticateUser(req);
    
    // Get the user ID from the query parameter or use the authenticated user's ID
    const userId = req.query.userId || authUser.id;
    
    console.log(`Fetching profile for user: ${userId}`);
    
    // Connect to the database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Query the database for the user profile
    const userProfile = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!userProfile || userProfile.length === 0) {
      console.log('User profile not found');
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    console.log('User profile loaded successfully');
    
    // Return the user profile
    return res.status(200).json({
      profile: userProfile[0]
    });
  } catch (error) {
    console.error('Error in users/profile endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}