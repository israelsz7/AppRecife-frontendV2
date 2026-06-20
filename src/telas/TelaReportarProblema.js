import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { obterLocalizacaoAtual } from '../servicos/localizacaoService';
import { enviarRelato } from '../servicos/relatosService';

const OPCOES_PROBLEMA = [
  'Lâmpada queimada',
  'Poste caído',
  'Fiação exposta',
  'Poste piscando',
];

export default function TelaReportarProblema({ route, navigation }) {
  const poste = route.params?.poste;

  const [problema, setProblema] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleEnviar() {
    if (!problema) {
      Alert.alert('Atenção', 'Escolha o tipo de problema antes de enviar.');
      return;
    }

    setEnviando(true);
    try {
      const localizacao = await obterLocalizacaoAtual();

      await enviarRelato({
        idPoste: poste?.id,
        endereco: poste?.endereco,
        problema,
        latitudeUsuario: localizacao.latitude,
        longitudeUsuario: localizacao.longitude,
      });

      Alert.alert('Sucesso', 'Relato enviado com sucesso!');
      navigation.navigate('MeusRelatos');
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Reportar problema no poste</Text>

      {poste && (
        <View style={estilos.cartaoPoste}>
          <Text style={estilos.enderecoPoste}>{poste.endereco}</Text>
          <Text style={estilos.distanciaPoste}>
            {poste.distanciaKm.toFixed(2)} km de você
          </Text>
        </View>
      )}

      <Text style={estilos.rotulo}>Tipo de problema</Text>
      <View style={estilos.opcoes}>
        {OPCOES_PROBLEMA.map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[
              estilos.opcao,
              problema === opcao && estilos.opcaoSelecionada,
            ]}
            onPress={() => setProblema(opcao)}
          >
            <Text
              style={[
                estilos.textoOpcao,
                problema === opcao && estilos.textoOpcaoSelecionada,
              ]}
            >
              {opcao}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={estilos.botaoEnviar}
        onPress={handleEnviar}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBotaoEnviar}>Enviar relato</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  cartaoPoste: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  enderecoPoste: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  distanciaPoste: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  opcoes: {
    marginBottom: 24,
  },
  opcao: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  opcaoSelecionada: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  textoOpcao: {
    fontSize: 14,
    color: '#374151',
  },
  textoOpcaoSelecionada: {
    color: '#fff',
    fontWeight: '600',
  },
  botaoEnviar: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoEnviar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
