import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card,Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/AuthService';

const RepositoriesScreen = () => {
    const [repos, setRepos] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const reposWithCommits = await AuthService.getRepositories('Dizkm8', token);
                setRepos(reposWithCommits);
            } catch (error) {
                console.error('Error al obtener repositorios:', error);
            }
        };

        fetchRepos();
    }, [token]);

    const handleViewMore = (repo) => {
    navigation.navigate('RepositoryDetailsScreen', { repoName: repo.name });
};

    return (
        <View style={styles.container}>
            <FlatList
                data={repos}
                keyExtractor={repo => repo.id.toString()}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.repoInfo}>
                                <Text style={styles.repoName}>{item.name}</Text>
                                <Text>Creado el: {new Date(item.created_at).toLocaleDateString()}</Text>
                                <Text>Actualizado el: {new Date(item.updated_at).toLocaleDateString()}</Text>
                                <Text>Commits: {item.commitCount}</Text>
                            </View>
                            <Button 
                              style={styles.viewMoreButton} 
                              onPress={() => handleViewMore(item)}
                            >
                              Ver más
                            </Button>
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
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  repoName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repoInfo: {
    flex: 1,
  },
  viewMoreButton: {
  },
});

export default RepositoriesScreen;

