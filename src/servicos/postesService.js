import { URL_API_RECIFE_POSTES, ID_RECURSO_POSTES_2025 } from './config';

// Os dados da prefeitura usam vírgula como separador decimal (ex: "-8,081171377")
// parseFloat sozinho não entende vírgula, então trocamos por ponto antes de converter
function paraNumero(valorTexto) {
  if (typeof valorTexto !== 'string') return NaN;
  return parseFloat(valorTexto.replace(',', '.'));
}

// Distância entre dois pontos geográficos (fórmula de Haversine)
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const raioDaTerraKm = 6371;
  const diferencaLat = ((lat2 - lat1) * Math.PI) / 180;
  const diferencaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(diferencaLat / 2) * Math.sin(diferencaLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(diferencaLon / 2) *
      Math.sin(diferencaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return raioDaTerraKm * c;
}

// Busca postes do Recife (Centro) e ordena pelos mais próximos do usuário
export async function buscarPostesProximos(latitudeUsuario, longitudeUsuario) {
  // Busca um lote grande de registros; o filtro por bairro é feito abaixo,
  // localmente, porque a busca por texto da API (q=) pode trazer bairros
  // parecidos (ex: "Recife" aparecendo em outro campo que não o bairro)
  const url =
    `${URL_API_RECIFE_POSTES}?resource_id=${ID_RECURSO_POSTES_2025}&limit=500`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error('Não foi possível buscar os postes na API do Recife.');
  }

  const dados = await resposta.json();
  const registros = dados?.result?.records || [];

  const postes = registros
    .filter((registro) => registro.bairro === 'Recife')
    .map((registro) => {
      const latitude = paraNumero(registro.latitude);
      const longitude = paraNumero(registro.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        return null;
      }

      return {
        // _id é gerado pelo banco de dados da prefeitura e é sempre único;
        // id_ponto às vezes vem vazio (null), por isso não confiamos nele
        id: registro._id,
        endereco: registro.endereco || 'Endereço não informado',
        bairro: registro.bairro || '',
        latitude,
        longitude,
        tipoLampada: registro.tipo_lumin || 'Não informado',
        distanciaKm: calcularDistanciaKm(
          latitudeUsuario,
          longitudeUsuario,
          latitude,
          longitude
        ),
      };
    })
    .filter((poste) => poste !== null);

  postes.sort((a, b) => a.distanciaKm - b.distanciaKm);

  return postes.slice(0, 20);
}
