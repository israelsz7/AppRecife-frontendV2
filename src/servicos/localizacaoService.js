import * as Location from 'expo-location';

// Pede permissão e retorna { latitude, longitude } do usuário
export async function obterLocalizacaoAtual() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error(
      'Permissão de localização negada. Ative a localização para ver os postes próximos.'
    );
  }

  const posicao = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: posicao.coords.latitude,
    longitude: posicao.coords.longitude,
  };
}
