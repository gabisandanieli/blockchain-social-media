module.exports = async function(callback) {
    const SocialMedia = artifacts.require("SocialMedia");

    try {
        const socialMedia = await SocialMedia.deployed();
        const accounts = await web3.eth.getAccounts();
        const testAccount = accounts[0]; // Use a primeira conta do Ganache como exemplo

        // Adiciona recompensas à conta de teste
        await socialMedia.addReward(testAccount, web3.utils.toWei('0.01', 'ether'));
        await socialMedia.addReward(testAccount, web3.utils.toWei('0.01', 'ether'));
        await socialMedia.addReward(testAccount, web3.utils.toWei('0.01', 'ether'));

        // Financia o contrato com ETH
        await socialMedia.fundContract({ from: testAccount, value: web3.utils.toWei('0.1', 'ether') });

        // Exibe o saldo de recompensas e o saldo do contrato
        const rewardBalance = await socialMedia.getRewardBalance({ from: testAccount });
        console.log("Saldo de recompensas (em ether):", web3.utils.fromWei(rewardBalance, 'ether'), "ETH");

        const contractBalance = await web3.eth.getBalance(socialMedia.address);
        console.log("Saldo do contrato:", web3.utils.fromWei(contractBalance, 'ether'), "ETH");

        callback();
    } catch (error) {
        console.error("Erro ao inicializar o contrato:", error);
        callback(error);
    }
};
