import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { useCharacterStore } from '@/stores/useCharacterStore';

const JOYSTICK_RADIUS = 50;
const JOYSTICK_SIZE = 150;

export function Joystick() {
    const [stickX, setStickX] = useState(0);
    const [stickY, setStickY] = useState(0);
    const setVelocity = useCharacterStore((state) => state.setVelocity);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, { dx, dy }) => {
                // 원 범위 내로 제한
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > JOYSTICK_RADIUS) {
                    const ratio = JOYSTICK_RADIUS / distance;
                    setStickX(dx * ratio);
                    setStickY(dy * ratio);
                } else {
                    setStickX(dx);
                    setStickY(dy);
                }

                // 캐릭터 속도 업데이트
                const velocityX = (dx / JOYSTICK_RADIUS) * 0.1;
                const velocityY = (dy / JOYSTICK_RADIUS) * 0.1;
                setVelocity(velocityX, velocityY);
            },
            onPanResponderRelease: () => {
                setStickX(0);
                setStickY(0);
                setVelocity(0, 0);
            },
        })
    ).current;

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            {/* 조이스틱 스틱 */}
            <View
                style={[
                    styles.stick,
                    { transform: [{ translateX: stickX }, { translateY: stickY }] },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
        borderRadius: JOYSTICK_SIZE / 2,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stick: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
});
