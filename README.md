# AppRecife - Frontend

Aplicativo mobile feito com React Native e Expo, para a atividade de Desenvolvimento de App Mobile Individual.

O app mostra os postes de iluminação pública do bairro Recife (Centro), ordenados pela distância até a localização do usuário, e permite reportar problemas em um poste (lâmpada queimada, poste caído, etc).

## O que esse projeto faz

O app tem três telas:

- **Postes Próximos**: pega a localização do usuário e busca os postes do bairro Recife na API de Dados Abertos da Prefeitura, mostrando os mais próximos primeiro.
- **Reportar Problema**: formulário para escolher o tipo de problema em um poste e enviar o relato para o backend.
- **Meus Relatos**: lista todos os relatos já enviados, buscando do backend.

O app se comunica com dois servidores:

- A API de Dados Abertos do Recife (dados dos postes).
- O backend próprio do projeto (repositório AppRecife-backendV2), que guarda os relatos enviados.

## Estrutura do projeto

```
AppRecife-frontendV2/
├── App.js                          # navegação entre as telas
├── app.json                        # configurações do Expo
├── index.js                        # ponto de entrada do app
├── assets/                         # ícones e imagens
├── src/
│   ├── telas/
│   │   ├── TelaPostesProximos.js
│   │   ├── TelaReportarProblema.js
│   │   └── TelaMeusRelatos.js
│   └── servicos/
│       ├── config.js               # endereços das APIs usadas
│       ├── postesService.js        # busca os postes na API do Recife
│       ├── relatosService.js       # envia e busca relatos no backend
│       └── localizacaoService.js   # pede permissão e pega a localização
├── package.json
└── LICENSE
```

## Como rodar o projeto na sua máquina

Pré-requisitos:

- Ter o Node.js instalado.
- Ter o app Expo Go instalado no celular (disponível na Play Store e App Store).
- Celular e computador conectados na mesma rede Wi-Fi.

1. Clone o repositório:
```
git clone https://github.com/israelsz7/AppRecife-frontendV2.git
```

2. Entre na pasta:
```
cd AppRecife-frontendV2
```

3. Instale as dependências:
```
npm install
```

4. Configure o endereço do backend. Abra o arquivo `src/servicos/config.js` e troque o IP pelo IP do seu computador na rede Wi-Fi (não use "localhost"):
```
export const URL_BACKEND = 'http://SEU_IP_AQUI:3000';
```

Para descobrir seu IP:
- Windows: `ipconfig` no terminal, procure "Endereço IPv4"
- Mac/Linux: `ifconfig` ou `ip a`

5. Certifique-se de que o backend (repositório AppRecife-backendV2) está rodando ao mesmo tempo, em outro terminal.

6. Inicie o app:
```
npx expo start
```

7. Escaneie o QR Code que aparece no terminal usando o app Expo Go no celular.

## Tecnologias usadas

- React Native
- Expo (SDK 54)
- React Navigation (navegação entre telas)
- expo-location (geolocalização do usuário)
- API de Dados Abertos do Recife (dados dos postes de iluminação)

## Observação

A API da prefeitura usa vírgula como separador decimal nas coordenadas (exemplo: "-8,081171377"). O código trata esse formato antes de calcular distâncias, para evitar erros de leitura dos números.

Esse app depende do backend (repositório AppRecife-backendV2) estar rodando para o envio e a listagem de relatos funcionarem.
