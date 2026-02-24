const { Client } = require("@notionhq/client");
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * 텍스트를 노션의 블록 제한(2000자)에 맞춰 자릅니다.
 */
function splitText(text, limit = 2000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += limit) {
        chunks.push(text.substring(i, i + limit));
    }
    return chunks;
}

/**
 * 데일리 뉴스를 노션 데이터베이스에 추가합니다.
 */
async function addDailyNewsEntry(title, summary, date, url = "") {
    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                '제목': { title: [{ text: { content: title } }] },
                '날짜': { date: { start: date } },
                '분류': { select: { name: 'Daily' } },
                'URL': { url: url || null },
                '요약': { rich_text: [{ text: { content: summary.substring(0, 2000) } }] } // 검색을 위해 속성에도 저장
            },
            children: [
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: { rich_text: [{ text: { content: "📋 핵심 요약" } }] }
                },
                ...splitText(summary).map(chunk => ({
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{ type: 'text', text: { content: chunk } }]
                    }
                }))
            ]
        });
        console.log(`✅ 노션 업로드 성공: ${title}`);
    } catch (error) {
        console.error('❌ 노션 업로드 실패:', error.body || error);
    }
}

/**
 * 주간 리포트를 위해 지난 7일간의 데일리 뉴스를 가져옵니다.
 */
async function fetchLastWeekNews() {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    { property: '날짜', date: { on_or_after: lastWeek.toISOString().split('T')[0] } },
                    { property: '분류', select: { equals: 'Daily' } }
                ]
            }
        });

        return response.results.map(page => ({
            title: page.properties['제목'].title[0]?.plain_text || '제목 없음',
            summary: page.properties['요약'].rich_text[0]?.plain_text || '내용 없음'
        }));
    } catch (error) {
        console.error('❌ 데이터 불러오기 실패:', error);
        return [];
    }
}

/**
 * 주간 TOP 10 리포트를 노션에 업로드합니다.
 */
async function addWeeklyReport(reportContent, date) {
    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                '제목': { title: [{ text: { content: `⭐ 주간 AI 하이라이트 TOP 10 (${date})` } }] },
                '날짜': { date: { start: date } },
                '분류': { select: { name: 'Weekly' } }
            },
            children: splitText(reportContent).map(chunk => ({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [{ type: 'text', text: { content: chunk } }]
                }
            }))
        });
        console.log(`✅ 주간 리포트 업로드 성공!`);
    } catch (error) {
        console.error('❌ 주간 리포트 업로드 실패:', error);
    }
}

module.exports = { addDailyNewsEntry, fetchLastWeekNews, addWeeklyReport };
