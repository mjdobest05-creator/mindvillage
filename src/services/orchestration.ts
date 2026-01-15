import { generateFlashCards } from './gemini';
import { extractTextFromPDF } from './pdf';
import { addFlashCard } from '../database/queries';
import { useUserStore } from '../stores/useUserStore';

export const processStudyMaterial = async (file: File) => {
    try {
        // 1. PDF에서 텍스트 추출
        const text = await extractTextFromPDF(file);

        // 2. Gemini로 플래시카드 생성
        const flashCards = await generateFlashCards(text);

        // 3. Firestore에 저장
        const user = useUserStore.getState().user;
        if (!user) throw new Error('User not authenticated');

        for (const card of flashCards) {
            await addFlashCard(user.id, {
                userId: user.id, // Type definition requires userId in Flashcard
                question: card.question,
                answer: card.answer,
                difficulty: 'medium',
                nextReviewDate: new Date().toISOString(),
                reviewCount: 0,
                // SM-2 Algorithm initial values
                interval: 1,
                ease_factor: 2.5,
                repetitions: 0,
            });
        }

        return flashCards;
    } catch (error) {
        console.error('Error processing study material:', error);
        throw error;
    }
};
