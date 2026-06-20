import { URL_BACKEND } from './config';

// Envia um novo relato (POST /relatos)
export async function enviarRelato(relato) {
  const resposta = await fetch(`${URL_BACKEND}/relatos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(relato),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || 'Não foi possível enviar o relato.');
  }

  return resposta.json();
}

// Busca todos os relatos enviados (GET /relatos)
export async function buscarRelatos() {
  const resposta = await fetch(`${URL_BACKEND}/relatos`);

  if (!resposta.ok) {
    throw new Error('Não foi possível buscar os relatos.');
  }

  return resposta.json();
}
