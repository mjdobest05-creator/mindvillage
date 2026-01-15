import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
} from 'firebase/firestore';
import { db } from './firebase';
import { Tree, FlashCard } from '@/types/index';

export const addTree = async (tree: Omit<Tree, 'id'>) => {
    const docRef = await addDoc(collection(db, 'trees'), tree);
    return docRef.id;
};

export const getTrees = async (userId: string): Promise<Tree[]> => {
    const q = query(collection(db, 'trees'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as Tree[];
};

export const updateTree = async (treeId: string, updates: Partial<Tree>) => {
    const treeRef = doc(db, 'trees', treeId);
    await updateDoc(treeRef, updates);
};

export const deleteTree = async (treeId: string) => {
    await deleteDoc(doc(db, 'trees', treeId));
};

export const addFlashCard = async (card: Omit<FlashCard, 'id'>) => {
    const docRef = await addDoc(collection(db, 'flashcards'), card);
    return docRef.id;
};

export const getFlashCards = async (userId: string): Promise<FlashCard[]> => {
    const q = query(collection(db, 'flashcards'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as FlashCard[];
};
