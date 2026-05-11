import 'dotenv/config';
import { getLatestNews, disconnectDb } from '../server/dbProvider.js';

async function checkNews() {
  try {
    const news = await getLatestNews();
    console.log('Current News in Database:');
    if (!news || news.length === 0) {
      console.log('No news found.');
    } else {
      news.forEach((item, i) => {
        console.log(`[${i+1}] ${item.title}`);
        console.log(`    Date: ${item.date}`);
        console.log(`    Created At: ${item.created_at}`);
        console.log('---');
      });
    }
  } catch (err) {
    console.error('Error checking news:', err);
  } finally {
    await disconnectDb();
  }
}

checkNews();
