import { db } from './config';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import {
    Tree,
    Flashcard,
    ReviewRecord,
    User,
    COLLECTIONS,
} from '../types';

/**
 * ============================================
 * TREE QUERIES
 * ============================================
 */

export const createTree = async (
    userId: string,
    treeData: Omit<Tree, 'id' | 'created_at' | 'updated_at'>
): Promise<Tree> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.TREES), {
            ...treeData,
            user_id: userId,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        });

        return {
            id: docRef.id,
            ...treeData,
            created_at: new Date(),
            updated_at: new Date(),
        } as Tree;
    } catch (error) {
        console.error('Failed to create tree:', error);
        throw error;
    }
};

export const getTreeById = async (treeId: string): Promise<Tree | null> => {
    try {
        const docRef = doc(db, COLLECTIONS.TREES, treeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            } as Tree;
        }
        return null;
    } catch (error) {
        console.error('Failed to get tree:', error);
        throw error;
    }
};

export const getTreesByUserId = async (userId: string): Promise<Tree[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.TREES),
            where('user_id', '==', userId)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Tree[];
    } catch (error) {
        console.error('Failed to get trees:', error);
        throw error;
    }
};

export const updateTree = async (
    treeId: string,
    updates: Partial<Tree>
): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTIONS.TREES, treeId);
        await updateDoc(docRef, {
            ...updates,
            updated_at: Timestamp.now(),
        });
    } catch (error) {
        console.error('Failed to update tree:', error);
        throw error;
    }
};

export const deleteTree = async (treeId: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTIONS.TREES, treeId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Failed to delete tree:', error);
        throw error;
    }
};

/**
 * ============================================
 * FLASHCARD QUERIES
 * ============================================
 */

export const createFlashcard = async (
    userId: string,
    flashcardData: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>
): Promise<Flashcard> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.FLASHCARDS), {
            ...flashcardData,
            user_id: userId,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        });

        return {
            id: docRef.id,
            ...flashcardData,
            created_at: new Date(),
            updated_at: new Date(),
        } as Flashcard;
    } catch (error) {
        console.error('Failed to create flashcard:', error);
        throw error;
    }
};

// Alias for backward compatibility
export const addFlashCard = createFlashcard;

export const getFlashcardsByTreeId = async (treeId: string): Promise<Flashcard[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.FLASHCARDS),
            where('tree_id', '==', treeId)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Flashcard[];
    } catch (error) {
        console.error('Failed to get flashcards:', error);
        throw error;
    }
};

export const getFlashcardsByUserId = async (userId: string): Promise<Flashcard[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.FLASHCARDS),
            where('user_id', '==', userId)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Flashcard[];
    } catch (error) {
        console.error('Failed to get flashcards by user:', error);
        throw error;
    }
};

export const updateFlashcard = async (
    flashcardId: string,
    updates: Partial<Flashcard>
): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTIONS.FLASHCARDS, flashcardId);
        await updateDoc(docRef, {
            ...updates,
            updated_at: Timestamp.now(),
        });
    } catch (error) {
        console.error('Failed to update flashcard:', error);
        throw error;
    }
};

export const deleteFlashcard = async (flashcardId: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTIONS.FLASHCARDS, flashcardId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Failed to delete flashcard:', error);
        throw error;
    }
};

/**
 * ============================================
 * REVIEW RECORD QUERIES
 * ============================================
 */

export const createReviewRecord = async (
    userId: string,
    reviewData: Omit<ReviewRecord, 'id'>
): Promise<ReviewRecord> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
            ...reviewData,
            user_id: userId,
            reviewed_at: Timestamp.now(),
        });

        return {
            id: docRef.id,
            ...reviewData,
        } as ReviewRecord;
    } catch (error) {
        console.error('Failed to create review record:', error);
        throw error;
    }
};

export const getReviewsByFlashcardId = async (
    flashcardId: string
): Promise<ReviewRecord[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.REVIEWS),
            where('flashcard_id', '==', flashcardId),
            orderBy('reviewed_at', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ReviewRecord[];
    } catch (error) {
        console.error('Failed to get reviews:', error);
        throw error;
    }
};

export const getReviewsByUserId = async (userId: string): Promise<ReviewRecord[]> => {
    try {
        const q = query(
            collection(db, COLLECTIONS.REVIEWS),
            where('user_id', '==', userId),
            orderBy('reviewed_at', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ReviewRecord[];
    } catch (error) {
        console.error('Failed to get reviews by user:', error);
        throw error;
    }
};

/**
 * ============================================
 * USER QUERIES
 * ============================================
 */

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
            ...userData,
            created_at: Timestamp.now(),
        });

        return {
            id: docRef.id,
            ...userData,
        } as User;
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error;
    }
};

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const docRef = doc(db, COLLECTIONS.USERS, userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            } as User;
        }
        return null;
    } catch (error) {
        console.error('Failed to get user:', error);
        throw error;
    }
};

/**
 * ============================================
 * TEST HELPERS (Mock 데이터 사용)
 * ============================================
 */

export const testQueries = async () => {
    console.log('Testing Firestore queries...');

    // TODO: Mock 데이터로 쿼리 테스트
    // 실제 Firestore는 Day 5에 연결
};
