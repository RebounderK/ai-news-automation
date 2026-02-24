const { fetchLatestAINews } = require('./lib/search');
const { summarizeNews, selectWeeklyTop10 } = require('./lib/gemini');
const { addDailyNewsEntry, fetchLastWeekNews, addWeeklyReport } = require('./lib/notion');
const { DateTime } = require('luxon');
require('dotenv').config();

async function runDailyTask() {
    console.log('--- Starting Daily AI News Task ---');
    const news = await fetchLatestAINews(1);

    if (news.length === 0) {
        console.log('No news found for today.');
        return;
    }

    // Combine news for summarizing or summarize individually
    // For simplicity, we summarize key news items together or just take top results
    const summary = await summarizeNews(news.slice(0, 5)); // Summarize top 5 news

    const today = DateTime.now().setZone('Asia/Seoul').toISODate();
    await addDailyNewsEntry('오늘의 AI 주요 뉴스 요약', summary, today);
}

async function runWeeklyTask() {
    console.log('--- Starting Weekly AI News Highlight Task ---');
    const weeklyNews = await fetchLastWeekNews();

    if (weeklyNews.length === 0) {
        console.log('No daily news found in Notion for the past week.');
        return;
    }

    const weeklyReport = await selectWeeklyTop10(weeklyNews);
    const today = DateTime.now().setZone('Asia/Seoul').toISODate();

    await addWeeklyReport(weeklyReport, today);
}

async function main() {
    const now = DateTime.now().setZone('Asia/Seoul');
    const isMonday = now.weekday === 1;

    // 1. Always run daily news fetch
    await runDailyTask();

    // 2. If Monday, run weekly summary
    if (isMonday) {
        await runWeeklyTask();
    }

    console.log('Done!');
}

main().catch(err => {
    console.error('Fatal error in main loop:', err);
});
