import React from 'react';
import { Tree, TreeHealthState } from '@/types';

const TREE_COLORS: Record<TreeHealthState, { trunk: string; leaves: string; alpha: number }> = {
    vibrant: { trunk: '#6b4423', leaves: '#2d5016', alpha: 0.9 },
    healthy: { trunk: '#8b6f47', leaves: '#4a7c27', alpha: 0.75 },
    dull: { trunk: '#a0917a', leaves: '#7a8a3f', alpha: 0.6 },
    brown: { trunk: '#9b8b7e', leaves: '#9d9d3e', alpha: 0.4 },
    dead: { trunk: '#8b7765', leaves: '#6d6d3d', alpha: 0.2 },
};

interface Tree3DProps {
    tree: Tree;
    position: [number, number, number];
}

export function Tree3D({ tree, position }: Tree3DProps) {
    const colors = TREE_COLORS[tree.health_state];

    return (
        <group position={position} castShadow receiveShadow>
            {/* 트렁크 */}
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
                <meshStandardMaterial color={colors.trunk} />
            </mesh>

            {/* 잎 (구체) */}
            <mesh position={[0, 3, 0]} castShadow>
                <sphereGeometry args={[1.2, 8, 8]} />
                <meshStandardMaterial color={colors.leaves} opacity={colors.alpha} transparent />
            </mesh>

            {/* 나무 클릭 감지용 히트박스 */}
            <mesh position={[0, 2.5, 0]} visible={false}>
                <sphereGeometry args={[1.5, 8, 8]} />
                <meshStandardMaterial />
            </mesh>
        </group>
    );
}
