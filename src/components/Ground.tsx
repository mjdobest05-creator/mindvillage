import React from 'react';
import { useRef } from 'react';
import * as THREE from 'three';

export function Ground() {
    const groundRef = useRef<THREE.Mesh>(null);

    return (
        <group>
            {/* 메인 지면 */}
            <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                {/* 넓은 평면 */}
                <planeGeometry args={[200, 200]} />

                {/* 초록색 재질 */}
                <meshStandardMaterial
                    color="#2d5016"
                    metalness={0}
                    roughness={0.8}
                />
            </mesh>

            {/* 그리드 패턴 */}
            <gridHelper args={[200, 40, '#1a3d0f', '#1a3d0f']} position={[0, 0.01, 0]} />
        </group>
    );
}
