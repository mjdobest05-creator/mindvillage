import { ReviewRecord, Flashcard } from '../types';

export interface ReviewStatistics {
    total_reviews: number;
    correct_count: number;
    incorrect_count: number;
    accuracy_rate: number; // 0-100
    average_response_time: number; // ms
    review_streak_days: number;
    daily_reviews: number;
    weekly_reviews: number;
    monthly_reviews: number;
}

/**
 * 복습 통계 계산
 */
export const calculateReviewStatistics = (
    reviews: ReviewRecord[],
    flashcards: Flashcard[]
): ReviewStatistics => {
    const totalReviews = reviews.length;
    const correctCount = reviews.filter((r) => r.isCorrect || r.is_correct).length;
    const incorrectCount = totalReviews - correctCount;
    const accuracyRate = totalReviews > 0 ? (correctCount / totalReviews) * 100 : 0;

    const totalResponseTime = reviews.reduce(
        (sum, r) => sum + (r.responseTime || r.response_time || 0),
        0
    );
    const averageResponseTime =
        totalReviews > 0 ? totalResponseTime / totalReviews : 0;

    const now = new Date();

    // 일일 복습 (오늘)
    const todayReviews = reviews.filter((r) => {
        const reviewDate = new Date(r.reviewedAt || r.reviewed_at || new Date());
        return (
            reviewDate.getFullYear() === now.getFullYear() &&
            reviewDate.getMonth() === now.getMonth() &&
            reviewDate.getDate() === now.getDate()
        );
    }).length;

    // 주간 복습 (최근 7일)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyReviews = reviews.filter(
        (r) => new Date(r.reviewedAt || r.reviewed_at || new Date()).getTime() >= weekAgo.getTime()
    ).length;

    // 월간 복습 (최근 30일)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthlyReviews = reviews.filter(
        (r) => new Date(r.reviewedAt || r.reviewed_at || new Date()).getTime() >= monthAgo.getTime()
    ).length;

    // 연속 학습일 계산
    const streakDays = calculateStreakDays(reviews);

    return {
        total_reviews: totalReviews,
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        accuracy_rate: parseFloat(accuracyRate.toFixed(2)),
        average_response_time: Math.round(averageResponseTime),
        review_streak_days: streakDays,
        daily_reviews: todayReviews,
        weekly_reviews: weeklyReviews,
        monthly_reviews: monthlyReviews,
    };
};

/**
 * 연속 학습일 계산
 */
const calculateStreakDays = (reviews: ReviewRecord[]): number => {
    if (reviews.length === 0) return 0;

    // 날짜별로 그룹화
    const dateSet = new Set<string>();
    reviews.forEach((r) => {
        const date = new Date(r.reviewedAt || r.reviewed_at || new Date());
        dateSet.add(date.toISOString().split('T')[0]);
    });

    const sortedDates = Array.from(dateSet).sort().reverse();
    if (sortedDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];

        if (sortedDates.includes(expectedDateStr)) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Spaced Repetition 간격 계산 (SM-2 알고리즘)
 * 
 * SM-2 알고리즘:
 * - 정답일 경우: repetitions++, interval 계산, ease_factor 조정
 * - 오답일 경우: repetitions = 0, interval = 1, ease_factor 감소
 */
export const calculateNextReviewDate = (
    currentFlashcard: Flashcard,
    isCorrect: boolean,
    quality: number = 5 // 0-5 품질 점수 (5가 완벽한 기억)
): { interval: number; easeFactor: number; repetitions: number; nextReviewDate: Date } => {
    let interval = currentFlashcard.interval || 1;
    let easeFactor = currentFlashcard.ease_factor || 2.5;
    let repetitions = currentFlashcard.repetitions || 0;

    if (isCorrect) {
        repetitions++;
        if (repetitions === 1) {
            interval = 1;
        } else if (repetitions === 2) {
            interval = 3;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        // SM-2 ease factor 공식
        easeFactor = Math.max(
            1.3,
            easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
        );
    } else {
        repetitions = 0;
        interval = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return {
        interval,
        easeFactor: parseFloat(easeFactor.toFixed(2)),
        repetitions,
        nextReviewDate
    };
};

/**
 * 일별 학습량 통계 (최근 7일)
 */
export const getDailyReviewCounts = (reviews: ReviewRecord[]): { date: string; count: number }[] => {
    const counts: Record<string, number> = {};
    const now = new Date();

    // 최근 7일 초기화
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        counts[date.toISOString().split('T')[0]] = 0;
    }

    // 리뷰 카운트
    reviews.forEach((r) => {
        const dateStr = new Date(r.reviewedAt || r.reviewed_at || new Date()).toISOString().split('T')[0];
        if (counts[dateStr] !== undefined) {
            counts[dateStr]++;
        }
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
};

/**
 * 난이도별 정확도
 */
export const getAccuracyByDifficulty = (
    reviews: ReviewRecord[],
    flashcards: Flashcard[]
): Record<'easy' | 'medium' | 'hard', number> => {
    const flashcardMap = new Map(flashcards.map(f => [f.id, f]));

    const stats: Record<'easy' | 'medium' | 'hard', { correct: number; total: number }> = {
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 },
    };

    reviews.forEach((r) => {
        const flashcard = flashcardMap.get(r.flashcardId || r.flashcard_id || '');
        if (flashcard) {
            const difficulty = flashcard.difficulty as 'easy' | 'medium' | 'hard';
            stats[difficulty].total++;
            if (r.isCorrect || r.is_correct) {
                stats[difficulty].correct++;
            }
        }
    });

    return {
        easy: stats.easy.total > 0 ? (stats.easy.correct / stats.easy.total) * 100 : 0,
        medium: stats.medium.total > 0 ? (stats.medium.correct / stats.medium.total) * 100 : 0,
        hard: stats.hard.total > 0 ? (stats.hard.correct / stats.hard.total) * 100 : 0,
    };
};
