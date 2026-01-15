import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Tree3D } from './Tree3D';
import { mockTrees } from '@/database/mockData';

export const Village3D = () => {
    return (
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />

            {mockTrees.map((tree) => (
                <Tree3D key={tree.id} tree={tree} />
            ))}
        </Canvas>
    );
};
