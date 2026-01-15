import { ReviewStatistics } from './ReviewStatisticsService';

export interface MetacognitionFeedback {
    overall_assessment: 'excellent' | 'good' | 'need_improvement' | 'struggling';
    accuracy_feedback: string;
    speed_feedback: string;
    consistency_feedback: string;
    recommendations: string[];
    next_focus_areas: string[];
    motivation_message: string;
}

/**
 * 학습 패턴 분석 및 메타인지 피드백 생성
 */
export const generateMetacognitionFeedback = (
    stats: ReviewStatistics
): MetacognitionFeedback => {
    const accuracy = stats.accuracy_rate;
    const responseTime = stats.average_response_time;
    const consistency = stats.daily_reviews > 0 ? 'consistent' : 'inconsistent';

    // 전체 평가
    let overallAssessment: MetacognitionFeedback['overall_assessment'];
    if (accuracy >= 85 && stats.daily_reviews > 0) {
        overallAssessment = 'excellent';
    } else if (accuracy >= 70) {
        overallAssessment = 'good';
    } else if (accuracy >= 50) {
        overallAssessment = 'need_improvement';
    } else {
        overallAssessment = 'struggling';
    }

    // 정확도 피드백
    let accuracyFeedback = '';
    if (accuracy >= 85) {
        accuracyFeedback = '정확도가 우수합니다! 이 페이스로 계속 진행하세요.';
    } else if (accuracy >= 70) {
        accuracyFeedback = '정확도가 좋습니다. 조금 더 어려운 문제에 도전해보세요.';
    } else if (accuracy >= 50) {
        accuracyFeedback = '정확도 개선이 필요합니다. 개념을 다시 검토하세요.';
    } else {
        accuracyFeedback = '정확도가 낮습니다. 기초부터 다시 학습하는 것을 권장합니다.';
    }

    // 속도 피드백
    let speedFeedback = '';
    if (responseTime < 2000) {
        speedFeedback = '매우 빠른 응답 속도입니다. 자신감이 있는 것으로 보입니다.';
    } else if (responseTime < 5000) {
        speedFeedback = '적절한 응답 속도입니다.';
    } else if (responseTime < 10000) {
        speedFeedback = '응답 시간이 조금 깁니다. 개념을 더 익히면 속도가 빨라질 것입니다.';
    } else {
        speedFeedback = '응답 시간이 매우 깁니다. 기본 개념 복습이 필요해 보입니다.';
    }

    // 일관성 피드백
    let consistencyFeedback = '';
    if (stats.review_streak_days >= 7) {
        consistencyFeedback = '일주일 연속 학습 중! 훌륭한 습관입니다!';
    } else if (stats.daily_reviews > 3) {
        consistencyFeedback = '매일 꾸준히 학습하고 있습니다. 좋은 습관입니다!';
    } else if (stats.weekly_reviews > 5) {
        consistencyFeedback = '일주일에 적당량 학습하고 있습니다.';
    } else if (stats.weekly_reviews > 0) {
        consistencyFeedback = '학습 빈도가 낮습니다. 매일 조금씩이라도 공부하세요.';
    } else {
        consistencyFeedback = '최근 학습 기록이 없습니다. 오늘부터 다시 시작해보세요!';
    }

    // 추천사항
    const recommendations: string[] = [];
    if (accuracy < 70) {
        recommendations.push('틀린 문제를 다시 검토하세요');
    }
    if (stats.daily_reviews === 0) {
        recommendations.push('매일 최소 1개의 플래시카드를 복습하세요');
    }
    if (responseTime > 5000) {
        recommendations.push('개념 설명을 다시 읽고 복습하세요');
    }
    if (stats.review_streak_days === 0) {
        recommendations.push('연속 학습 기록을 시작해보세요');
    }
    if (accuracy >= 85 && stats.daily_reviews >= 3) {
        recommendations.push('새로운 주제의 플래시카드를 추가해보세요');
    }

    // 다음 학습 영역
    const nextFocusAreas: string[] = [];
    if (accuracy >= 85) {
        nextFocusAreas.push('더 어려운 난이도의 문제 도전');
        nextFocusAreas.push('새로운 학습 주제 탐색');
    } else if (accuracy >= 70) {
        nextFocusAreas.push('중간 난이도 문제 복습');
        nextFocusAreas.push('오답 패턴 분석');
    } else {
        nextFocusAreas.push('쉬운 난이도부터 기초 다지기');
        nextFocusAreas.push('핵심 개념 재정리');
    }

    // 동기부여 메시지
    const motivationMessage = getMotivationMessage(overallAssessment, stats);

    return {
        overall_assessment: overallAssessment,
        accuracy_feedback: accuracyFeedback,
        speed_feedback: speedFeedback,
        consistency_feedback: consistencyFeedback,
        recommendations,
        next_focus_areas: nextFocusAreas,
        motivation_message: motivationMessage,
    };
};

/**
 * 동기부여 메시지 생성
 */
const getMotivationMessage = (
    assessment: MetacognitionFeedback['overall_assessment'],
    stats: ReviewStatistics
): string => {
    if (stats.review_streak_days >= 7) {
        return `🎉 대단해요! ${stats.review_streak_days}일 연속 학습 중입니다! 나무들이 무럭무럭 자라고 있어요!`;
    }

    switch (assessment) {
        case 'excellent':
            return '🌟 완벽해요! 당신의 나무 숲이 건강하게 자라고 있습니다!';
        case 'good':
            return '💪 잘하고 있어요! 조금만 더 노력하면 마스터가 될 수 있어요!';
        case 'need_improvement':
            return '🌱 포기하지 마세요! 꾸준한 연습이 실력을 만듭니다!';
        case 'struggling':
            return '🤗 천천히 가도 괜찮아요. 기초부터 차근차근 다시 시작해봐요!';
        default:
            return '📚 오늘도 함께 공부해요!';
    }
};

/**
 * 학습 레벨 계산
 */
export const calculateLearningLevel = (stats: ReviewStatistics): {
    level: number;
    title: string;
    nextLevelProgress: number;
} => {
    const totalScore =
        stats.total_reviews * 10 +
        stats.correct_count * 5 +
        stats.review_streak_days * 20;

    const levels = [
        { min: 0, title: '새싹 학습자' },
        { min: 100, title: '초보 정원사' },
        { min: 300, title: '열정 학습자' },
        { min: 600, title: '숙련된 정원사' },
        { min: 1000, title: '지식 수호자' },
        { min: 2000, title: '마스터 정원사' },
        { min: 5000, title: '전설의 학자' },
    ];

    let currentLevel = 1;
    let currentTitle = levels[0].title;
    let nextLevelMin = levels[1]?.min || Infinity;

    for (let i = levels.length - 1; i >= 0; i--) {
        if (totalScore >= levels[i].min) {
            currentLevel = i + 1;
            currentTitle = levels[i].title;
            nextLevelMin = levels[i + 1]?.min || levels[i].min * 2;
            break;
        }
    }

    const currentMin = levels[currentLevel - 1]?.min || 0;
    const progress = ((totalScore - currentMin) / (nextLevelMin - currentMin)) * 100;

    return {
        level: currentLevel,
        title: currentTitle,
        nextLevelProgress: Math.min(100, Math.max(0, progress)),
    };
};

/**
 * 학습 성향 분석
 */
export const analyzeLearningPattern = (stats: ReviewStatistics): {
    pattern: 'consistent' | 'burst' | 'sporadic' | 'inactive';
    description: string;
} => {
    if (stats.weekly_reviews === 0) {
        return {
            pattern: 'inactive',
            description: '최근 학습 활동이 없습니다.',
        };
    }

    const avgDaily = stats.weekly_reviews / 7;

    if (stats.review_streak_days >= 5 || avgDaily >= 2) {
        return {
            pattern: 'consistent',
            description: '꾸준한 학습 패턴을 보이고 있습니다. 최고예요!',
        };
    }

    if (stats.daily_reviews >= 10) {
        return {
            pattern: 'burst',
            description: '집중적인 학습 스타일입니다. 분산 학습도 고려해보세요.',
        };
    }

    return {
        pattern: 'sporadic',
        description: '불규칙한 학습 패턴입니다. 일정한 시간에 학습하면 더 효과적입니다.',
    };
};
