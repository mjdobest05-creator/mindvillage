import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { useCharacterStore } from '@/stores/useCharacterStore';
import { CameraFollower } from './Camera/CameraFollower';
import { Ground } from './Ground';
import { Character3D } from './Character3D';
import { Tree3D } from './Tree3D';
import { mockTrees } from '@/database/mockData';

export function VillageCanvas3D() {
    const character = useCharacterStore((state) => state.character);

    return (
        <Canvas
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            camera={{ position: [0, 5, 10], fov: 75 }}
            shadows
        >
            {/* 조명 */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />

            {/* 환경 */}
            <Suspense fallback={null}>
                <Sky distance={450000} sunPosition={[100, 10, 100]} />
                <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
            </Suspense>

            {/* 카메라 (캐릭터를 따라감) */}
            <CameraFollower characterPosition={character.position} />

            {/* 메인 씬 */}
            <VillageScene />
        </Canvas>
    );
}

function VillageScene() {
    return (
        <>
            {/* 지형 */}
            <Ground />

            {/* 캐릭터 */}
            <Character3D />

            {/* 나무들 */}
            {mockTrees.map((tree) => (
                <Tree3D
                    key={tree.id}
                    tree={tree}
                    position={[tree.x / 10, 0, tree.y / 10]}
                />
            ))}
        </>
    );
}
