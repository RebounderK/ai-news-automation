const axios = require('axios');
require('dotenv').config();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

async function fetchLatestAINews(days = 1) {
    if (!TAVILY_API_KEY) {
        console.warn('TAVILY_API_KEY is missing. Skipping search.');
        return [];
    }

    try {
        const response = await axios.post('https://api.tavily.com/search', {
            api_key: TAVILY_API_KEY,
            query: 'latest AI news technology LLM generative AI OpenAI Anthropic Google',
            search_depth: 'advanced',
            include_answer: false,
            include_images: false,
            max_results: 15,
            days: days
        });

        return response.data.results.map(result => ({
            title: result.title,
            url: result.url,
            content: result.content,
            published_date: new Date().toISOString() // Tavily doesn't always provide specific pub dates, so we use crawl date
        }));
    } catch (error) {
        console.error('Error fetching news from Tavily:', error.message);
        return [];
    }
}

module.exports = { fetchLatestAINews };
