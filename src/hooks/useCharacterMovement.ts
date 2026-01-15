import { useEffect } from 'react';
import { useCharacterStore } from '@/stores/useCharacterStore';
import { useTreeStore } from '@/stores/useTreeStore';
import { mockTrees } from '@/database/mockData';

const MOVEMENT_SPEED = 0.1;
const MAP_BOUNDS = 50;

export function useCharacterMovement() {
    const character = useCharacterStore((state) => state.character);
    const setMoving = useCharacterStore((state) => state.setMoving);
    const setPosition = useCharacterStore((state) => state.setPosition);
    const setRotation = useCharacterStore((state) => state.setRotation);

    useEffect(() => {
        const animationFrame = setInterval(() => {
            if (character.velocityX === 0 && character.velocityY === 0) {
                setMoving(false);
                return;
            }

            setMoving(true);

            // 새로운 위치 계산
            let newX = character.position.x + character.velocityX * MOVEMENT_SPEED;
            let newZ = character.position.z + character.velocityY * MOVEMENT_SPEED;

            // 맵 경계 검사
            newX = Math.max(-MAP_BOUNDS, Math.min(MAP_BOUNDS, newX));
            newZ = Math.max(-MAP_BOUNDS, Math.min(MAP_BOUNDS, newZ));

            // 나무와의 충돌 감지 (mockTrees의 x, y를 position으로 사용)
            const hasCollision = mockTrees.some((tree) => {
                const treeX = tree.x / 10; // VillageCanvas3D에서 사용하는 스케일과 동일
                const treeZ = tree.y / 10;
                const distance = Math.sqrt(
                    Math.pow(newX - treeX, 2) + Math.pow(newZ - treeZ, 2)
                );
                return distance < 1.5; // 충돌 반경
            });

            if (!hasCollision) {
                setPosition({ ...character.position, x: newX, z: newZ });
            }

            // 회전 계산 (velocity 방향)
            if (character.velocityX !== 0 || character.velocityY !== 0) {
                const angle = Math.atan2(character.velocityX, character.velocityY);
                setRotation(angle);
            }
        }, 16); // ~60fps

        return () => clearInterval(animationFrame);
    }, [character, setMoving, setPosition, setRotation]);
}
