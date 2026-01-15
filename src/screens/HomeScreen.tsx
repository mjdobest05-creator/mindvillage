import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '@/stores/useUserStore';
import { mockUser } from '@/database/mockData';

export const HomeScreen = ({ navigation }: any) => {
    const setUser = useUserStore((state) => state.setUser);

    const handleLogin = () => {
        setUser(mockUser);
        navigation.navigate('Village');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌿 MindVillage</Text>
            <Text style={styles.subtitle}>학습으로 나무를 키우세요</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>시작하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
