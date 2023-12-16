import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/AuthService';

const RepositoryDetailsScreen = ({ route }) => {
    const [commits, setCommits] = useState([]);
    const { token } = useContext(AuthContext);
    const { repoName } = route.params;

    useEffect(() => {
        const fetchCommits = async () => {
            try {
                const fetchedCommits = await AuthService.getCommits(repoName, token);
                setCommits(fetchedCommits);
            } catch (error) {
                console.error('Error al obtener commits:', error);
            }
        };

        fetchCommits();
    }, [repoName, token]);

    return (
        <View style={styles.container}>
            <Text style={styles.repoName}>{repoName}</Text>
            <FlatList
                data={commits}
                keyExtractor={commit => commit.id.toString()}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text>{item.message}</Text>
                            <Text>{new Date(item.date).toLocaleDateString()}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    repoName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    card: {
        marginVertical: 5,
    },
});

export default RepositoryDetailsScreen;