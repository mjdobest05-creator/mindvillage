import { create } from 'zustand';
import { CharacterState, Position3D } from '../types/index';

interface CharacterStore {
    character: CharacterState;
    setPosition: (position: Position3D) => void;
    setRotation: (rotation: number) => void;
    setVelocity: (velocityX: number, velocityY: number) => void;
    setMoving: (isMoving: boolean) => void;
    updateCharacter: (updates: Partial<CharacterState>) => void;
}

export const useCharacterStore = create<CharacterStore>((set) => ({
    character: {
        position: { x: 0, y: 0, z: 0 },
        rotation: 0,
        velocityX: 0,
        velocityY: 0,
        isMoving: false,
    },
    setPosition: (position) =>
        set((state) => ({
            character: { ...state.character, position },
        })),
    setRotation: (rotation) =>
        set((state) => ({
            character: { ...state.character, rotation },
        })),
    setVelocity: (velocityX, velocityY) =>
        set((state) => ({
            character: { ...state.character, velocityX, velocityY },
        })),
    setMoving: (isMoving) =>
        set((state) => ({
            character: { ...state.character, isMoving },
        })),
    updateCharacter: (updates) =>
        set((state) => ({
            character: { ...state.character, ...updates },
        })),
}));
