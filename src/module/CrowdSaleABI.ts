export const CrowdSaleABI = [{"inputs": [{"internalType": "address payable", "name": "crowdsaleWallet", "type": "address"}, {"internalType": "contract IERC20", "name": "token", "type": "address"}], "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [], "name": "CrowdsaleFinalized", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}], "name": "OwnershipTransferred", "type": "event"}, {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "purchaser", "type": "address"}, {"indexed": true, "internalType": "address", "name": "beneficiary", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "TokensPurchased",
    "type": "event"
}, {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "_balances", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "_balancesPurchased", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "_capTokenSale", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "_currentSaleToken", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "_finalizedTime", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {
    "inputs": [],
    "name": "_isStopped",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {"inputs": [], "name": "_token", "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "account", "type": "address"}], "name": "balanceOf", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function"}, {"inputs": [], "name": "depositTokenSale", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "finalize", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "finalized", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"}, {
    "inputs": [],
    "name": "hasClosed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
}, {"inputs": [], "name": "isDepositedTokenSale", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "isOpen", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "openingTime", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "owner", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "rate", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "remainingTokenSale", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {"inputs": [], "name": "start", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "stop", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "token", "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "wallet", "outputs": [{"internalType": "address payable", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "weiRaised", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {
    "inputs": [],
    "name": "withdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "withdrawableTokens", "outputs": [{"internalType": "bool", "name": "", "type": "bool"}], "stateMutability": "view", "type": "function"}, {"stateMutability": "payable", "type": "receive"}];