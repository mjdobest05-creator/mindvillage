import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCharacterStore } from '@/stores/useCharacterStore';

export function Character3D() {
    const characterRef = useRef<THREE.Group>(null);
    const character = useCharacterStore((state) => state.character);

    useFrame(() => {
        if (!characterRef.current) return;

        // 캐릭터 위치 업데이트
        characterRef.current.position.set(
            character.position.x,
            character.position.y,
            character.position.z
        );

        // 회전 업데이트
        characterRef.current.rotation.y = character.rotation;
    });

    return (
        <group ref={characterRef} castShadow receiveShadow>
            {/* 바디 */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <capsuleGeometry args={[0.3, 1.0, 4, 8]} />
                <meshStandardMaterial color="#ff6b6b" />
            </mesh>

            {/* 헤드 */}
            <mesh position={[0, 1.3, 0]} castShadow>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#ffdbac" />
            </mesh>

            {/* 왼쪽 눈 */}
            <mesh position={[-0.08, 1.35, 0.23]} castShadow>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#000000" />
            </mesh>

            {/* 오른쪽 눈 */}
            <mesh position={[0.08, 1.35, 0.23]} castShadow>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#000000" />
            </mesh>
        </group>
    );
}
