import { Tree, TreeHealthState } from '../types';
import { updateTree } from '../database/queries';

/**
 * 나무의 건강 상태 계산
 * 
 * vibrant (생생함): 최근 3일 내 복습
 * healthy (건강): 최근 7일 내 복습
 * dull (흐릿함): 최근 14일 내 복습
 * brown (갈색): 3주 이상 복습 안 함
 * dead (죽음): 한 달 이상 복습 안 함
 */
export const calculateTreeHealthState = (tree: Tree): TreeHealthState => {
    if (!tree.last_review_date) {
        return 'dull'; // 처음 심은 나무는 흐릿함
    }

    const now = new Date();
    const lastReviewDate = new Date(tree.last_review_date);
    const daysSinceReview = Math.floor(
        (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceReview <= 3) return 'vibrant';
    if (daysSinceReview <= 7) return 'healthy';
    if (daysSinceReview <= 14) return 'dull';
    if (daysSinceReview <= 21) return 'brown';
    return 'dead';
};

/**
 * 연속 복습 일수 계산
 */
export const calculateConsecutiveReviews = async (
    treeId: string,
    reviewRecords: Array<{ reviewed_at: Date; is_correct: boolean }>
): Promise<number> => {
    if (reviewRecords.length === 0) return 0;

    let consecutive = 0;
    const sortedByDate = reviewRecords.sort(
        (a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedByDate.length; i++) {
        const reviewDate = new Date(sortedByDate[i].reviewed_at);
        reviewDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (reviewDate.getTime() === expectedDate.getTime() && sortedByDate[i].is_correct) {
            consecutive++;
        } else {
            break;
        }
    }

    return consecutive;
};

/**
 * 나무 상태 업데이트
 */
export const updateTreeHealthState = async (
    treeId: string,
    tree: Tree,
    reviewRecords: Array<{ reviewed_at: Date; is_correct: boolean }>
) => {
    const newHealthState = calculateTreeHealthState(tree);
    const newConsecutiveReviews = await calculateConsecutiveReviews(treeId, reviewRecords);

    await updateTree(treeId, {
        health_state: newHealthState,
        consecutive_reviews: newConsecutiveReviews,
    });
};

/**
 * 건강 상태에 따른 색상 반환
 */
export const getHealthStateColor = (state: TreeHealthState): string => {
    const colors: Record<TreeHealthState, string> = {
        vibrant: '#22c55e', // 생생한 녹색
        healthy: '#84cc16', // 연한 녹색
        dull: '#eab308',    // 노란색
        brown: '#a3622d',   // 갈색
        dead: '#6b7280',    // 회색
    };
    return colors[state];
};

/**
 * 건강 상태에 따른 설명 반환
 */
export const getHealthStateDescription = (state: TreeHealthState): string => {
    const descriptions: Record<TreeHealthState, string> = {
        vibrant: '나무가 아주 건강해요! 계속 복습해주세요.',
        healthy: '나무가 건강해요. 조금 더 자주 복습하면 좋겠어요.',
        dull: '나무가 시들어가고 있어요. 빨리 복습해주세요!',
        brown: '나무가 말라가고 있어요! 지금 바로 복습하세요!',
        dead: '나무가 죽었어요... 새로운 나무를 심어보세요.',
    };
    return descriptions[state];
};

/**
 * 다음 복습까지 남은 일수 계산
 */
export const getDaysUntilNextReview = (tree: Tree): number => {
    if (!tree.last_review_date) return 0;

    const lastReview = new Date(tree.last_review_date);
    const now = new Date();
    const daysSince = Math.floor(
        (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
    );

    // vibrant 상태 유지를 위해 3일 내 복습 권장
    return Math.max(0, 3 - daysSince);
};
