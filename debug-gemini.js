const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini2() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        console.log('Testing gemini-2.0-flash...');
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log('✅ Success! Response:', response.text());
    } catch (error) {
        console.error(`❌ Failed: ${error.status} ${error.message}`);
    }
}

testGemini2();
