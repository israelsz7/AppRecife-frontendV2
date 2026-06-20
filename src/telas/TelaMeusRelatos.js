import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { buscarRelatos } from '../servicos/relatosService';

export default function TelaMeusRelatos() {
  const [relatos, setRelatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function carregarRelatos() {
    setErro(null);
    try {
      const lista = await buscarRelatos();
      setRelatos(lista.slice().reverse()); // mostra os mais recentes primeiro
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  // Recarrega sempre que a tela ganha foco (ex: depois de enviar um relato)
  useFocusEffect(
    useCallback(() => {
      carregarRelatos();
    }, [])
  );

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>{erro}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={relatos}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={estilos.lista}
      refreshControl={
        <RefreshControl refreshing={carregando} onRefresh={carregarRelatos} />
      }
      ListEmptyComponent={
        <View style={estilos.centro}>
          <Text style={estilos.textoVazio}>Nenhum relato enviado ainda.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={estilos.cartao}>
          <Text style={estilos.problema}>{item.problema}</Text>
          <Text style={estilos.endereco}>{item.endereco}</Text>
          <Text style={estilos.data}>
            {new Date(item.criadoEm).toLocaleString('pt-BR')}
          </Text>
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textoErro: {
    color: '#b91c1c',
    textAlign: 'center',
  },
  textoVazio: {
    color: '#888',
  },
  lista: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#f4f5f7',
  },
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  problema: {
    fontSize: 15,
    fontWeight: '700',
    color: '#b91c1c',
  },
  endereco: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  data: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
  },
});
