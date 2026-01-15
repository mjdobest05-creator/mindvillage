// ============================================
// Firestore Collections
// ============================================

export const COLLECTIONS = {
    USERS: 'users',
    TREES: 'trees',
    FLASHCARDS: 'flashcards',
    REVIEWS: 'reviews',
} as const;

// ============================================
// Domain Models
// ============================================

export type TreeHealthState = 'vibrant' | 'healthy' | 'dull' | 'brown' | 'dead';

export interface Tree {
    id: string;
    userId: string;
    user_id?: string; // Firestore compatibility
    name: string;
    x: number;
    y: number;
    health_state: TreeHealthState;
    plantedDate: string;
    lastWateredDate?: string;
    last_review_date?: string; // For lifecycle calculation
    daysAlive: number;
    consecutive_reviews?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    avatarUrl?: string;
}

export interface FlashCard {
    id: string;
    userId: string;
    user_id?: string; // Firestore compatibility
    tree_id?: string; // Associated tree
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
    nextReviewDate: string;
    reviewCount: number;
    // SM-2 Algorithm fields
    interval: number; // days until next review
    ease_factor: number; // difficulty factor (default 2.5)
    repetitions: number; // number of consecutive correct answers
    created_at?: Date;
    updated_at?: Date;
}

// Alias for Firestore queries (snake_case convention)
export type Flashcard = FlashCard;

export interface StudyStats {
    userId: string;
    totalReviews: number;
    correctReviews: number;
    studyStreak: number;
    lastStudyDate: string;
}

export interface ReviewRecord {
    id: string;
    flashcardId: string;
    flashcard_id?: string; // Firestore compatibility
    treeId: string;
    tree_id?: string; // Firestore compatibility
    userId: string;
    user_id?: string; // Firestore compatibility
    isCorrect: boolean;
    is_correct?: boolean; // Firestore compatibility
    responseTime: number; // milliseconds
    response_time?: number; // Firestore compatibility
    reviewedAt: string;
    reviewed_at?: Date; // Firestore compatibility
}

export interface Settings {
    dailyGoal: number;
    notificationEnabled: boolean;
    darkMode: boolean;
    language: 'ko' | 'en' | 'ja';
    pdfExtractionMethod: 'ocr' | 'text';
}

// ============================================
// UI State Models
// ============================================

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration: number; // ms
}

export interface ModalState {
    isOpen: boolean;
    type: 'plant' | 'settings' | 'stats' | 'interceptor' | null;
    data?: any;
}

// ============================================
// API Response Models
// ============================================

export interface GeminiFlashcardResponse {
    flashcards: Array<{
        question: string;
        answer: string;
        difficulty: 'easy' | 'medium' | 'hard';
    }>;
    summary: string;
}

export interface PDFExtractionResult {
    text: string;
    pageCount: number;
    fileName: string;
}

// ============================================
// 3D Rendering Models
// ============================================

export interface Position3D {
    x: number;
    y: number;
    z: number;
}

export interface CharacterState {
    position: Position3D;
    rotation: number; // radian
    velocityX: number;
    velocityY: number;
    isMoving: boolean;
}

export interface TreeVisualsConfig {
    healthState: TreeHealthState;
    species: 'oak' | 'pine' | 'maple' | 'cherry' | 'birch';
    scale: number;
    leafColor: string;
    trunkColor: string;
}
