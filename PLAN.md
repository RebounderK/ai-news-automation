# AI News Automation System Implementation Plan

## 1. Goal
- Daily AI news research and summary (to Notion).
- Weekly (Monday) "Top 10 AI News" selection from the past week's data (to Notion).

## 2. Core Features
- **Daily Task**:
    1. Search for AI news from the last 24 hours.
    2. Summarize each news item using Gemini.
    3. Upload to Notion Database with "Daily" category.
- **Weekly Task (Mondays)**:
    1. Fetch all "Daily" news from the past 7 days from Notion.
    2. Ask Gemini to select and rank the top 10 most important news.
    3. Create a comprehensive weekly report.
    4. Upload to Notion with "Weekly" category.

## 3. Technology Stack
- **Runtime**: Node.js
- **Search API**: Tavily API (Optimized for AI research)
- **LLM API**: Gemini API
- **Database**: Notion API
- **Scheduler**: GitHub Actions

## 4. Implementation Steps
1. **Initialize Project**: Install dependencies (`@notionhq/client`, `@google/generative-ai`, `axios`, `dotenv`).
2. **Setup Credentials**: Prepare `.env` for API keys and Notion IDs.
3. **News Fetcher**: Implement logic to search for AI news.
4. **Gemini Brain**: Implement summarization and filtering logic.
5. **Notion Integration**: Implement functions to add entries and fetch past data.
6. **Main Logic**: CLI logic with flags or date checking to branch between Daily and Weekly tasks.
7. **Automation**: Create GitHub Action workflow file.
