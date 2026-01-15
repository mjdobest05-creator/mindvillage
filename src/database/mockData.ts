import { Tree, User, FlashCard, StudyStats } from '../types/index';

export const mockTrees: Tree[] = [
    {
        id: '1',
        userId: 'user-1',
        name: '첫 번째 나무',
        x: 0,
        y: 0,
        health_state: 'vibrant',
        plantedDate: '2026-01-01',
        lastWateredDate: '2026-01-15',
        daysAlive: 14,
    },
    {
        id: '2',
        userId: 'user-1',
        name: '두 번째 나무',
        x: 50,
        y: 50,
        health_state: 'healthy',
        plantedDate: '2026-01-10',
        daysAlive: 5,
    },
];

export const mockUser: User = {
    id: 'user-1',
    name: '테스트 사용자',
    email: 'user@example.com',
    createdAt: '2026-01-01',
};

export const mockFlashCards: FlashCard[] = [
    {
        id: '1',
        userId: 'user-1',
        question: 'React의 핵심 개념은?',
        answer: 'Component 기반의 UI 라이브러리',
        difficulty: 'easy',
        nextReviewDate: '2026-01-16',
        reviewCount: 3,
    },
];

export const mockStudyStats: StudyStats = {
    userId: 'user-1',
    totalReviews: 50,
    correctReviews: 45,
    studyStreak: 7,
    lastStudyDate: '2026-01-15',
};
