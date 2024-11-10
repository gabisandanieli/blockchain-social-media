console.log("app.js carregado");

let web3;
let socialMediaContract;

async function initializeWeb3() {
    console.log("Iniciando Web3...");

    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        console.log("Web3 inicializado com MetaMask.");

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("MetaMask conectado!");

            const accounts = await web3.eth.getAccounts();
            console.log("Conta ativa:", accounts[0]);

            // ABI completo do contrato SocialMedia
            const contractABI = [
                {
                  "anonymous": false,
                  "inputs": [
                    {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "id",
                      "type": "uint256"
                    },
                    {
                      "indexed": false,
                      "internalType": "address",
                      "name": "author",
                      "type": "address"
                    },
                    {
                      "indexed": false,
                      "internalType": "string",
                      "name": "content",
                      "type": "string"
                    },
                    {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "likes",
                      "type": "uint256"
                    }
                  ],
                  "name": "PostCreated",
                  "type": "event"
                },
                {
                  "anonymous": false,
                  "inputs": [
                    {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "id",
                      "type": "uint256"
                    },
                    {
                      "indexed": false,
                      "internalType": "address",
                      "name": "liker",
                      "type": "address"
                    },
                    {
                      "indexed": false,
                      "internalType": "uint256",
                      "name": "likes",
                      "type": "uint256"
                    }
                  ],
                  "name": "PostLiked",
                  "type": "event"
                },
                {
                  "inputs": [],
                  "name": "postCount",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function",
                  "constant": true
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "name": "posts",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "id",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address payable",
                      "name": "author",
                      "type": "address"
                    },
                    {
                      "internalType": "string",
                      "name": "content",
                      "type": "string"
                    },
                    {
                      "internalType": "uint256",
                      "name": "likes",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function",
                  "constant": true
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "name": "rewards",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function",
                  "constant": true
                },
                {
                  "inputs": [
                    {
                      "internalType": "string",
                      "name": "_content",
                      "type": "string"
                    }
                  ],
                  "name": "createPost",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "_id",
                      "type": "uint256"
                    }
                  ],
                  "name": "likePost",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "getRewardBalance",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function",
                  "constant": true
                },
                {
                  "inputs": [],
                  "name": "withdrawRewards",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "fundContract",
                  "outputs": [],
                  "stateMutability": "payable",
                  "type": "function",
                  "payable": true
                }
              ];

            const contractAddress = '0xCcd78f8A02Eb1e601c9658B303Fa69a2F72fEaeb';

            console.log("Iniciando contrato com endereço:", contractAddress);

            // Inicializa a instância do contrato
            socialMediaContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contrato SocialMedia carregado com sucesso:", socialMediaContract);

            loadPosts(); // Carrega os posts após a inicialização

        } catch (error) {
            console.error("Erro ao conectar ao MetaMask ou ao contrato:", error);
        }
    } else {
        alert('MetaMask não encontrado. Por favor, instale o MetaMask para usar esta aplicação.');
    }
}

// Função para criar um novo post
async function createPost() {
    const content = document.getElementById('postContent').value;
    if (content === '') {
        alert('Por favor, insira um conteúdo para o post.');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    try {
        await socialMediaContract.methods.createPost(content).send({ from: accounts[0] });
        document.getElementById('postContent').value = ''; // Limpa o campo de entrada após o post
        loadPosts(); // Recarrega a lista de posts
        alert("Post criado com sucesso!");
    } catch (error) {
        console.error("Erro ao criar o post:", error);
    }
}

// Função para carregar todos os posts existentes
async function loadPosts() {
    const postCount = await socialMediaContract.methods.postCount().call();
    const postList = document.getElementById('postList');
    postList.innerHTML = ''; // Limpa a lista de posts

    for (let i = 1; i <= postCount; i++) {
        const post = await socialMediaContract.methods.posts(i).call();
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <p><strong>Autor:</strong> ${post.author}</p>
            <p>${post.content}</p>
            <p><strong>Curtidas:</strong> ${post.likes}</p>
            <button onclick="likePost(${post.id})">Curtir</button>
        `;
        postList.appendChild(postElement);
    }
}

// Função para curtir um post específico
async function likePost(postId) {
    const accounts = await web3.eth.getAccounts();
    try {
        await socialMediaContract.methods.likePost(postId).send({ from: accounts[0] });
        loadPosts(); // Recarrega a lista de posts para atualizar as curtidas
    } catch (error) {
        console.error("Erro ao curtir o post:", error);
    }
}

// Função para consultar o saldo de recompensas da conta atual
async function getRewardBalance() {
    const accounts = await web3.eth.getAccounts();
    try {
        const balance = await socialMediaContract.methods.getRewardBalance().call({ from: accounts[0] });
        document.getElementById('rewardBalance').innerText = `Saldo: ${web3.utils.fromWei(balance, 'ether')} ETH`;
    } catch (error) {
        console.error("Erro ao obter o saldo de recompensas:", error);
    }
}

// Função para tentar sacar recompensas com verificação de saldo
async function attemptWithdrawRewards() {
    const accounts = await web3.eth.getAccounts();
    try {
        const balance = await socialMediaContract.methods.getRewardBalance().call({ from: accounts[0] });
        const etherBalance = web3.utils.fromWei(balance, 'ether');
        console.log("Saldo de recompensas (em ether):", etherBalance, "ETH");
        
        if (parseFloat(etherBalance) > 0.0001) { // Ajuste o valor mínimo conforme necessário
            await socialMediaContract.methods.withdrawRewards().send({ from: accounts[0] });
            alert("Recompensas sacadas com sucesso!");
            getRewardBalance(); // Atualiza o saldo de recompensas após o saque
        } else {
            alert("Saldo de recompensas muito baixo para saque.");
        }
    } catch (error) {
        console.error("Erro ao sacar recompensas:", error);
        alert("Erro ao sacar recompensas. Verifique o console para mais detalhes.");
    }
}

// Exporta as funções para o escopo global para serem acessíveis no HTML
window.createPost = createPost;
window.loadPosts = loadPosts;
window.likePost = likePost;
window.getRewardBalance = getRewardBalance;
window.attemptWithdrawRewards = attemptWithdrawRewards;

// Inicializa o Web3 e o contrato ao carregar a página
document.addEventListener('DOMContentLoaded', initializeWeb3);
