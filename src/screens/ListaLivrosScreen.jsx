import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const statusOptions = ['TODOS', 'LENDO', 'LIDO', 'QUERO_LER'];

// Mapeia cores do enunciado
const statusColors = {
  LENDO: { bg: '#E6F1FB', text: '#185FA5' },
  LIDO: { bg: '#EAF3DE', text: '#3B6D11' },
  QUERO_LER: { bg: '#FAEEDA', text: '#854F0B' },
};

export default function ListaLivrosScreen({ navigation }) {
  const [livros, setLivros] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregarLivros = async () => {
    setLoading(true);
    try {
      let url = '/livros';
      if (filtro !== 'TODOS') {
        url += `?status=${filtro}`;
      }
      const response = await api.get(url);
      setLivros(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, [filtro])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarLivros();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const cor = statusColors[item.status] || { bg: '#ddd', text: '#000' };
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cor.bg }]}
        onPress={() => navigation.navigate('DetalhesLivro', { livro: item })}
      >
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.autor}>{item.autor}</Text>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: cor.text }]}>
            {item.status === 'QUERO_LER' ? 'QUERO LER' : item.status}
          </Text>
        </View>
        {item.nota ? <Text style={styles.nota}>⭐ {item.nota}/5</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtroContainer}>
        {statusOptions.map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[styles.filtroBotao, filtro === opcao && styles.filtroAtivo]}
            onPress={() => setFiltro(opcao)}
          >
            <Text style={[styles.filtroTexto, filtro === opcao && styles.filtroTextoAtivo]}>
              {opcao === 'QUERO_LER' ? 'QUERO LER' : opcao}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#534AB7" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={livros}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum livro encontrado.</Text>}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FormularioLivro', { livro: null })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  filtroBotao: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  filtroAtivo: {
    backgroundColor: '#534AB7',
  },
  filtroTexto: {
    color: '#333',
    fontWeight: '500',
  },
  filtroTextoAtivo: {
    color: '#fff',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  autor: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  nota: {
    marginTop: 8,
    fontSize: 14,
    color: '#f59e0b',
  },
  vazio: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#534AB7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 40,
  },
});