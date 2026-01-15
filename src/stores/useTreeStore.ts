import { create } from 'zustand';
import { Tree } from '../types/index';

interface TreeStore {
    trees: Tree[];
    setTrees: (trees: Tree[]) => void;
    addTree: (tree: Tree) => void;
    updateTree: (id: string, tree: Partial<Tree>) => void;
    deleteTree: (id: string) => void;
}

export const useTreeStore = create<TreeStore>((set) => ({
    trees: [],
    setTrees: (trees) => set({ trees }),
    addTree: (tree) => set((state) => ({ trees: [...state.trees, tree] })),
    updateTree: (id, updates) =>
        set((state) => ({
            trees: state.trees.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
    deleteTree: (id) =>
        set((state) => ({
            trees: state.trees.filter((t) => t.id !== id),
        })),
}));
