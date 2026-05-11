import 'dotenv/config';
import { updateLegalNews } from '../server/newsService.js';
import { disconnectDb } from '../server/dbProvider.js';

async function triggerUpdate() {
  console.log('Starting manual news update...');
  try {
    await updateLegalNews();
    console.log('Manual update finished.');
  } catch (err) {
    console.error('Manual update failed:', err);
  } finally {
    await disconnectDb();
  }
}

triggerUpdate();
