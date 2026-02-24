const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Summarize a list of news items with retry logic for 429 errors
 */
async function summarizeNews(newsList) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    당신은 '생성형 AI 전문 뉴스 큐레이터'입니다. 다음 뉴스들을 분석하여 노션에 게시하기 좋은 깔끔하고 전문적인 리포트 형식으로 정리해 주세요.

    [작성 가이드라인]
    1. **선별**: 반드시 '생성형 AI(LLM, 이미지 생성, 비디오 생성 등)'와 직접 관련된 핵심 뉴스만 5~7개 선정하세요.
    2. **서식**: 각 뉴스는 아래 형식을 따르세요.
       - **[제목]**: 뉴스의 핵심 내용을 한눈에 알 수 있는 제목
       - **[요약]**: 2~3문장으로 구성된 핵심 내용 요약 (불렛 포인트 사용 권장)
       - **[의의]**: 해당 뉴스가 업계나 기술적으로 갖는 의미 (1문장)
    3. **이모지**: 적절한 이모지를 사용하여 가독성을 높이세요.
    4. **언어**: 한국어로 작성하되, 기술 용어는 필요시 영어와 병기하세요.

    뉴스 데이터:
    ${newsList.map((n, i) => `제목: ${n.title}\n내용: ${n.content}\n`).join('\n')}
    `;

    return callGeminiWithRetry(model, prompt);
}

/**
 * Select top 10 news from a week's worth of news
 */
async function selectWeeklyTop10(weeklyNews) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    당신은 'AI 트렌드 분석 전문가'입니다. 지난 한 주간의 생성형 AI 소식 중 가장 임팩트 있는 TOP 10을 선정하여 주간 하이라이트 리포트를 작성해 주세요.

    [작성 가이드라인]
    1. **구성**: 1위부터 10위까지 순위를 매겨 정리하세요.
    2. **서식**: 
       ### 🏆 [순위] 제목
       - **요약**: 핵심 내용 브리핑
       - **선정 이유**: 왜 이 뉴스가 이번 주 TOP 10에 포함되었는지에 대한 전문가적 식견
    3. **가독성**: 굵게(Bold), 이모지, 구분선 등을 적절히 활용하여 화려하고 보기 좋게 만드세요.
    4. **언어**: 한국어로 작성하세요.

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
