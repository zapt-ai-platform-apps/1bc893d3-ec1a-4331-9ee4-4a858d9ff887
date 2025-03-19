import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { hairdresserHairstyles } from '../../drizzle/schema.js';
import { authenticateUser } from '../_apiUtils.js';
import Sentry from '../_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Saving hairdresser hairstyles...');
    
    // Authenticate the user
    const authUser = await authenticateUser(req);
    
    const { userId, hairstyles, portfolioImages } = req.body;
    
    // Ensure userId matches authenticated user
    if (userId !== authUser.id) {
      return res.status(403).json({ error: 'User ID mismatch' });
    }
    
    // Connect to the database
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);
    
    // Delete existing hairstyle selections
    await db.delete(hairdresserHairstyles)
      .where(eq(hairdresserHairstyles.hairdresserId, userId));
    
    // Insert new hairstyle selections
    for (const hairstyle of hairstyles) {
      const images = portfolioImages[hairstyle.id] || [];
      
      await db.insert(hairdresserHairstyles)
        .values({
          hairdresserId: userId,
          hairstyleId: hairstyle.id,
          price: hairstyle.price,
          portfolioImages: images
        });
    }
    
    console.log('Hairdresser hairstyles saved successfully');
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in hairdresser-hairstyles endpoint:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }
}