import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/AuthService';

const RepositoriesScreen = () => {
    const [repos, setRepos] = useState([]);
    const { token} = useContext(AuthContext);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const repositories = await AuthService.getRepositories(token);
                setRepos(repositories);
            } catch (error) {
                console.error('Error al obtener repositorios:', error);
            }
        };

        fetchRepos();
    }, [token]);

    return (
        <View style={styles.container}>
            <FlatList
                data={repos}
                keyExtractor={repo => repo.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.repoContainer}>
                        <Text style={styles.repoName}>{item.name}</Text>
                        <Text>Fecha de Creación: {item.created_at}</Text>
                        {/* Agregar más detalles del repositorio aquí si es necesario */}
                    </View>
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
  repoContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  repoName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RepositoriesScreen;
