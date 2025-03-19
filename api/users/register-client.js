import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, clientProfiles } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import Sentry from '../_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Registering client...');
    
    // Authenticate the user
    const authUser = await authenticateUser(req);
    
    const { userId, firstName, lastName, phoneNumber } = req.body;
    
    // Ensure userId matches authenticated user
    if (userId !== authUser.id) {
      return res.status(403).json({ error: 'User ID mismatch' });
    }
    
    // Connect to the database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Insert user record
    await db.insert(users)
      .values({
        id: userId,
        email: authUser.email,
        firstName,
        lastName,
        phoneNumber,
        userType: 'client',
        isApproved: true
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          firstName,
          lastName,
          phoneNumber,
          userType: 'client',
          isApproved: true
        }
      });
    
    console.log('Client registration successful');
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in register-client endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}