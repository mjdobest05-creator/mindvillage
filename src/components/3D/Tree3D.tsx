import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Tree } from '@/types/index';

interface Tree3DProps {
    tree: Tree;
}

export const Tree3D = ({ tree }: Tree3DProps) => {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });

    const healthColors: Record<string, string> = {
        vibrant: '#00ff00',
        healthy: '#90ee90',
        dull: '#ffff00',
        brown: '#8b4513',
        dead: '#555555',
    };

    return (
        <mesh ref={meshRef} position={[tree.x / 100, 0, tree.y / 100]}>
            <coneGeometry args={[1, 3, 8]} />
            <meshStandardMaterial color={healthColors[tree.health_state]} />
        </mesh>
    );
};
