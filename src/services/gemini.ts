import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export const generateFlashCards = async (text: string) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
다음 텍스트를 기반으로 5개의 플래시카드를 생성하세요.
각 플래시카드는 question과 answer로 구성되어야 합니다.

텍스트:
${text}

JSON 형식으로 반환하세요:
[
  { "question": "...", "answer": "..." }
]
  `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
};
