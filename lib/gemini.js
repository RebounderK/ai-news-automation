const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Summarize a list of news items with retry logic for 429 errors
 */
async function summarizeNews(newsList) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    다음은 오늘 수집된 AI 관련 뉴스들입니다. 
    각 뉴스에 대해 핵심 내용을 1~2문장으로 요약하고, 관련 기술적 의의를 간단히 적어주세요.
    한국어로 작성해 주세요.

    뉴스 목록:
    ${newsList.map((n, i) => `[${i + 1}] 제목: ${n.title}\n내용: ${n.content}\n`).join('\n')}
  `;

    return callGeminiWithRetry(model, prompt);
}

/**
 * Select top 10 news from a week's worth of news
 */
async function selectWeeklyTop10(weeklyNews) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    다음은 지난 한 주간 수집된 AI 뉴스들입니다. 
    이 중에서 가장 중요도가 높고 파급력이 큰 뉴스 10개를 선정해서 랭킹순으로 정리해 주세요.
    각 뉴스마다 '선정 이유'를 포함해 주세요.
    한국어로 작성해 주세요.

    주간 뉴스 데이터:
    ${weeklyNews.map((n, i) => `제목: ${n.title}\n요약: ${n.summary}\n`).join('\n---\n')}
  `;

    return callGeminiWithRetry(model, prompt);
}

async function callGeminiWithRetry(model, prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            if (error.status === 429 && i < retries - 1) {
                console.warn(`Gemini Quota exceeded (429). Retrying in ${60 * (i + 1)} seconds...`);
                await new Promise(resolve => setTimeout(resolve, 60000 * (i + 1)));
                continue;
            }
            console.error('Gemini API Error:', error.status, error.message);
            return `에러 발생: ${error.status === 429 ? 'Gemini API 무료 할당량 초과. 잠시 후 다시 시도해 주세요.' : 'AI 요약 생성 중 오류가 발생했습니다.'}`;
        }
    }
}

module.exports = { summarizeNews, selectWeeklyTop10 };
