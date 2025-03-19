import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hairstyles } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import Sentry from '../_sentry.js';

export default async function handler(req, res) {
  try {
    console.log('Fetching hairstyles...');
    
    // Authenticate the user
    await authenticateUser(req);
    
    // Connect to the database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Query the database for hairstyles
    const allHairstyles = await db.select().from(hairstyles);
    
    console.log(`Found ${allHairstyles.length} hairstyles`);
    
    // Return the hairstyles
    return res.status(200).json(allHairstyles);
  } catch (error) {
    console.error('Error in hairstyles endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}