// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocialMedia {
    struct Post {
        uint256 id;
        address payable author;
        string content;
        uint256 likes;
    }

    mapping(uint256 => Post) public posts;
    mapping(address => uint256) public rewards;
    uint256 public postCount;

    event PostCreated(uint256 id, address author, string content, uint256 likes);
    event PostLiked(uint256 id, address liker, uint256 likes);

    // Criação de post
    function createPost(string memory _content) public {
        postCount++;
        posts[postCount] = Post(postCount, payable(msg.sender), _content, 0);
        emit PostCreated(postCount, msg.sender, _content, 0);
    }

    // Curtir post
    function likePost(uint256 _id) public {
        Post storage post = posts[_id];
        require(post.id > 0, "Post nao existe");

        post.likes++;
        rewards[post.author] += 1 wei; // Adiciona uma recompensa mínima para cada curtida
        emit PostLiked(_id, msg.sender, post.likes);
    }

    // Verificar saldo de recompensas
    function getRewardBalance() public view returns (uint256) {
        return rewards[msg.sender];
    }

    // Sacar recompensas
    function withdrawRewards() public {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "Nenhuma recompensa disponivel para saque");
        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);
    }

    // Função de teste para adicionar recompensas manualmente (apenas para ambiente de teste)
    function addReward(address _user, uint256 _amount) public {
        rewards[_user] += _amount;
    }

    // Função para financiar o contrato
    function fundContract() public payable {}
}
