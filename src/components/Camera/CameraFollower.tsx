import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Position3D } from '@/types';

const CAMERA_OFFSET = { x: 0, y: 8, z: 12 };
const CAMERA_SMOOTH = 0.1;

export function CameraFollower({ characterPosition }: { characterPosition: Position3D }) {
    const { camera } = useThree();
    const targetPosition = new THREE.Vector3();

    useFrame(() => {
        // 목표 위치 계산
        targetPosition.set(
            characterPosition.x + CAMERA_OFFSET.x,
            characterPosition.y + CAMERA_OFFSET.y,
            characterPosition.z + CAMERA_OFFSET.z
        );

        // 부드러운 카메라 이동
        camera.position.lerp(targetPosition, CAMERA_SMOOTH);

        // 카메라가 캐릭터를 바라보도록
        camera.lookAt(characterPosition.x, characterPosition.y + 1, characterPosition.z);
    });

    return null;
}
