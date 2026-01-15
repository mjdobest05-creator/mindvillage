import { View, Text, StyleSheet } from 'react-native';
import { VillageCanvas3D as Village3D } from '@/components/VillageCanvas3D';

export const VillageScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏘️ 마을</Text>
            <Village3D />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 16,
        paddingLeft: 16,
    },
});
