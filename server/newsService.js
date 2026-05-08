import Parser from 'rss-parser';
import { saveNewsList } from './dbProvider.js';

const parser = new Parser();

// The RSS feed URL for Indian Supreme Court/High Court judgments
const RSS_URL = 'https://news.google.com/rss/search?q=Supreme+Court+of+India+Judgments+OR+High+Court+Judgments&hl=en-IN&gl=IN&ceid=IN:en';

export async function updateLegalNews() {
  console.log('📰 [NewsService] Fetching latest legal news...');
  try {
    // 1. Fetch and parse RSS
    const feed = await parser.parseURL(RSS_URL);
    
    // Get top 5 items to give the model some context
    const topItems = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet || item.content
    }));

    if (topItems.length === 0) {
      console.log('📰 [NewsService] No news items found in RSS.');
      return;
    }

    // 2. Prepare NVIDIA API request
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ [NewsService] NVIDIA_API_KEY not found. Skipping news update.');
      return;
    }

    const systemPrompt = `You are a legal news summarizer for an Indian legal app called KanoonSaathi.
Your task is to take the provided raw RSS news items and extract the 3 most important and distinct Indian Supreme Court or High Court judgments.
For each of the 3 judgments, generate a strictly formatted JSON object matching this schema:
{
  "title": "Clear, concise title of the judgment",
  "court": "Supreme Court of India or Name of High Court",
  "bench": "Names of Justices (if mentioned, else 'Not specified')",
  "date": "YYYY-MM-DD format based on the pubDate",
  "caseNo": "Case number (if mentioned, else 'Not specified')",
  "category": "One of: Criminal Law, Civil Law, Fundamental Rights, Family Law, Corporate Law, Consumer Law, Other",
  "summaryPoints": [
    "Point 1: Key background or issue.",
    "Point 2: The court's primary ruling/decision.",
    "Point 3: The practical impact on citizens."
  ],
  "impact": "High, Medium, or Low",
  "tags": ["Tag1", "Tag2", "Tag3"]
}

Rules:
1. You MUST return ONLY a raw JSON array of 3 objects. NO markdown formatting, NO \`\`\`json wrappers, NO conversational text.
2. The summaryPoints array MUST have exactly 3 string items. Keep them easy to understand for a common citizen.
3. If the input doesn't have 3 clear judgments, do your best to summarize the top legal news items available in the text.`;

    const userPrompt = `Here are the latest RSS items:\n${JSON.stringify(topItems, null, 2)}`;

    console.log('📰 [NewsService] Calling NVIDIA API (meta/llama-3.1-70b-instruct) for summarization...');
    
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        max_tokens: 2048,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [NewsService] NVIDIA API error:', response.status, errorText);
      return;
    }

    const data = await response.json();
    let replyText = data.choices?.[0]?.message?.content || '';

    // Clean up potential markdown wrappers if the model ignores the prompt instruction
    replyText = replyText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const newsArray = JSON.parse(replyText);
      if (Array.isArray(newsArray) && newsArray.length > 0) {
        // 3. Save to database
        const success = await saveNewsList(newsArray);
        if (success) {
          console.log(`✅ [NewsService] Successfully updated ${newsArray.length} news items.`);
        } else {
          console.error('❌ [NewsService] Failed to save news to database.');
        }
      } else {
        console.error('❌ [NewsService] Invalid JSON format from API: Not an array.');
      }
    } catch (parseErr) {
      console.error('❌ [NewsService] Failed to parse JSON from API response:', replyText);
    }

  } catch (error) {
    console.error('❌ [NewsService] Error fetching or processing news:', error.message);
  }
}
