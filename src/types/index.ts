// ============================================
// Domain Models
// ============================================

export type TreeHealthState = 'vibrant' | 'healthy' | 'dull' | 'brown' | 'dead';

export interface Tree {
    id: string;
    userId: string;
    name: string;
    x: number;
    y: number;
    health_state: TreeHealthState;
    plantedDate: string;
    lastWateredDate?: string;
    daysAlive: number;
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
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
    nextReviewDate: string;
    reviewCount: number;
}

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
    treeId: string;
    userId: string;
    isCorrect: boolean;
    responseTime: number; // milliseconds
    reviewedAt: string;
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
