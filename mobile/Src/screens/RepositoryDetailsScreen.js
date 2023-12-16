import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import AuthService from '../services/AuthService';

// Componente para la pantalla que muestra los detalles de un repositorio.
const RepositoryDetailsScreen = ({ route }) => {
    const [commits, setCommits] = useState([]);
    const { token } = useContext(AuthContext);
    const { repoName } = route.params;

    // useEffect para cargar los commits al montar el componente
    useEffect(() => {
        const fetchCommits = async () => {
            try {
                // Llamada al servicio para obtener commits del repositorio
                const fetchedCommits = await AuthService.getCommits('Dizkm8',repoName, token);
                setCommits(fetchedCommits);// Actualiza el estado con los commits obtenidos
            } catch (error) {
                console.error('Error al obtener commits:', error);
            }
        };

        fetchCommits();
    }, [repoName, token]);// Dependencias del useEffect: repoName y token

    // Función para extraer la clave única de cada commit
    const keyExtractor = (commit) => commit.sha;

    // Renderiza los elementos de la interfaz de usuario
    return (
        <View style={styles.container}>
            <Text style={styles.repoName}>{repoName}</Text>
            <FlatList
                data={commits}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text>{item.commit.message}</Text>
                            <Text>{new Date(item.commit.author.date).toLocaleDateString()}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
};

// Estilos para los elementos de la pantalla
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