//SCRIPT 

const Web3 = require('web3');

// Create a new instance of Web3 with the TomoChain testnet provider
const web3 = new Web3('https://testnet.tomochain.com');

// Set up your account's private key or mnemonic phrase
const privateKey = '0x46387F4c609F63BA93c52ADF49208b9843056D17';

// Contract ABI and address
const contractABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_number",
                "type": "uint256"
            }
        ],
        "name": "storeNumber",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "retrieveNumber",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = '0x1A953dBd44f5a32af1bF9F004cAA3315E80c646a';

// Number of transactions to send
const numTransactions = 2;

// Function to send a single transaction to store a number
async function sendTransaction() {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Generate a random number to store
    const randomNumber = Math.floor(Math.random() * 100);

    try {
        // Call the contract's storeNumber function
        const tx = contract.methods.storeNumber(randomNumber);
        const encodedTx = tx.encodeABI();

        // Create the transaction object
        const txObject = {
            from: account.address,
            to: contractAddress,
            data: encodedTx,
            gas: 10000000,
            gasPrice: '1000000000000' // 1 Gwei
        };

        // Measure transaction time
        const startTime = Date.now();

        // Sign and send the transaction
        const signedTx = await account.signTransaction(txObject);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        const endTime = Date.now();
        const transactionTime = endTime - startTime;

        console.log('Transaction hash:', receipt.transactionHash);
        console.log('Transaction time:', transactionTime, 'ms');
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

// Function to send bulk transactions
async function sendBulkTransactions() {
    for (let i = 0; i < numTransactions; i++) {
        await sendTransaction();
    }
}

// Call the function to send bulk transactions
sendBulkTransactions();