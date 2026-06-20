import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import { obterLocalizacaoAtual } from '../servicos/localizacaoService';
import { buscarPostesProximos } from '../servicos/postesService';

export default function TelaPostesProximos({ navigation }) {
  const [postes, setPostes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  async function carregarPostes() {
    setErro(null);
    setCarregando(true);
    try {
      const localizacao = await obterLocalizacaoAtual();
      const listaPostes = await buscarPostesProximos(
        localizacao.latitude,
        localizacao.longitude
      );
      setPostes(listaPostes);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPostes();
  }, []);

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={estilos.textoCarregando}>Buscando postes próximos...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>{erro}</Text>
        <TouchableOpacity style={estilos.botaoTentarNovamente} onPress={carregarPostes}>
          <Text style={estilos.textoBotao}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <FlatList
        data={postes}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={carregando} onRefresh={carregarPostes} />
        }
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          <Text style={estilos.textoVazio}>Nenhum poste encontrado na região.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={estilos.cartao}
            onPress={() => navigation.navigate('Reportar', { poste: item })}
          >
            <View style={estilos.cartaoTopo}>
              <Text style={estilos.distancia}>{item.distanciaKm.toFixed(2)} km</Text>
            </View>
            <Text style={estilos.endereco}>{item.endereco}</Text>
            <Text style={estilos.detalhe}>Lâmpada: {item.tipoLampada}</Text>
            <Text style={estilos.linkReportar}>Toque para reportar problema</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f4f5f7',
  },
  textoCarregando: {
    marginTop: 12,
    fontSize: 15,
    color: '#555',
  },
  textoErro: {
    fontSize: 15,
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: 16,
  },
  botaoTentarNovamente: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: '600',
  },
  lista: {
    padding: 16,
  },
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cartaoTopo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  distancia: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  endereco: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  detalhe: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  linkReportar: {
    fontSize: 13,
    color: '#2563eb',
    marginTop: 8,
    fontWeight: '500',
  },
  textoVazio: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});
