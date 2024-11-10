
# Blockchain Social Media

Este é um projeto de uma rede social descentralizada construída com **Solidity** e **JavaScript**. A aplicação usa **Truffle** e **Ganache** para desenvolvimento e deploy de contratos inteligentes em um ambiente local, e **MetaMask** para conectar a carteira do usuário à blockchain.

## Funcionalidades

- **Criar Post**: Permite criar um post inserindo um conteúdo e clicando no botão "Postar".
- **Curtir Post**: Clique no botão "Curtir" em um post para aumentar a contagem de curtidas.
- **Ver Saldo de Recompensas**: Clique no botão "Ver Saldo de Recompensas" para visualizar o saldo atual de recompensas da conta.
- **Sacar Recompensas**: Clique no botão "Sacar Recompensas" para retirar o saldo de recompensas acumulado.

## Requisitos

Antes de iniciar, você precisará instalar as seguintes ferramentas:

- [Node.js e npm](https://nodejs.org/)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://www.trufflesuite.com/ganache) (para a blockchain local)
- [MetaMask](https://metamask.io/) (extensão no navegador para conectar à blockchain)

## Passos para Instalação e Configuração

1. **Clone este repositório**:

   ```bash
   git clone https://github.com/seu-usuario/blockchain-social-media.git
   cd blockchain-social-media
   ```

2. **Instale as dependências do projeto**:

   ```bash
   npm install
   ```

## Deploy do Contrato na Rede Local

1. **Inicie o Ganache**:

   Abra o Ganache e configure uma nova rede local. Certifique-se de que a porta está configurada como `7545`, que é o padrão usado pelo Truffle.

2. **Compile o Contrato**:

   No terminal, execute:

   ```bash
   truffle compile
   ```

3. **Migre o Contrato para o Ganache**:

   Realize o deploy dos contratos na rede local do Ganache:

   ```bash
   truffle migrate --network development
   ```

4. **Inicialize o Contrato com Valores de Teste** (opcional):

   Para configurar o contrato com recompensas de teste e financiar o contrato, execute o script `initializeContract.js`:

   ```bash
   truffle exec scripts/initializeContract.js
   ```

   Esse script configura uma conta de teste com recompensas e adiciona saldo ao contrato.

## Executando o Projeto

1. No terminal, execute o servidor local para a interface:

   ```bash
   npx http-server .
   ```

2. Abra o navegador e acesse [http://127.0.0.1:8080](http://127.0.0.1:8080).

3. Conecte-se ao MetaMask:
   - Certifique-se de que o MetaMask está configurado para a rede local (localhost:7545).
   - Conecte a conta com saldo ao MetaMask usando a chave privada do Ganache.

4. Agora você pode interagir com a interface, criando posts, curtindo e visualizando/sacando recompensas.

## Estrutura do Projeto

- **contracts/**: Contém o contrato inteligente `SocialMedia.sol`.
- **migrations/**: Scripts de migração do Truffle para deploy do contrato.
- **scripts/**: Contém o script `initializeContract.js` para adicionar recompensas e financiar o contrato para testes.
- **app.js**: Código JavaScript que conecta a interface ao contrato inteligente.
- **index.html**: Interface de usuário da aplicação.
- **style.css**: Estilos para a interface.

## Problemas Comuns

- **Erro de Conexão com MetaMask**: Verifique se você está na rede do Ganache no MetaMask.
- **Saldo Insuficiente do Contrato**: Se o contrato não tiver saldo, o saque de recompensas falhará. Use o script `initializeContract.js` para garantir que o contrato tenha saldo suficiente.
- **Erro "Transaction has been reverted by the EVM"**: Certifique-se de que o contrato possui saldo para cobrir o saque.
