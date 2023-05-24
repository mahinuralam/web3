import fs from 'fs';
import { create } from 'ipfs-http-client';
import Web3 from 'web3';
// Create a new instance of Web3 with the TomoChain testnet provider
const web3 = new Web3('https://api.s0.b.hmny.io');

// Set up your account's private key or mnemonic phrase
const privateKey = 'd29b3270cde597f2b9e62b3af453abf66bda3e1ffeff6467069dbb7c0110e211';

// Contract ABI and address
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_nodeID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_timerange",
				"type": "string"
			}
		],
		"name": "retrieveData",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_nodeID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_timerange",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_data",
				"type": "string"
			}
		],
		"name": "storeData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_nodeID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_timerange",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_data",
				"type": "string"
			}
		],
		"name": "verifyData",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const contractAddress = '0x327d72EbAa93C7044579821cb37B2eBEf19c042A';

// PDF file path
const pdfFilePath = '/Users/prismerp/Downloads/sample.png';

// Number of transactions to send
const numTransactions = 2;

// Create an IPFS client
// const ipfs = ipfsClient({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
// });

const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
    
  })
async function getIPFSHash(pdfFilePath) {
  try {
    // Read the PDF file
    const fileData = fs.readFileSync(pdfFilePath);

    // Add the file to IPFS
    const result = await ipfs.add(fileData);

    // Extract the IPFS hash
    const ipfsHash = result.path;

    return ipfsHash;
  } catch (error) {
    console.error('Error generating IPFS hash:', error);
    return null;
  }
}

// Function to send a single transaction to store an IPFS hash
async function sendTransaction() {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  try {
    // Measure transaction latency
    const startTime = Date.now();

    // Generate the IPFS hash for the PDF file
    const ipfsHash = await getIPFSHash(pdfFilePath);
    console.log('ipfsHash',ipfsHash)
    if (ipfsHash) {
      // Call the contract's storeIPFSHash function
      const tx = contract.methods.storeData(ipfsHash, "asd", "2023:12:12", "asd");
      const encodedTx = tx.encodeABI();

      // Create the transaction object
      const txObject = {
        from: account.address,
        to: contractAddress,
        data: encodedTx,
        gas: 10000000,
        gasPrice: '1000000000000' // 1 Gwei
      };

      // Sign and send the transaction
      const signedTx = await account.signTransaction(txObject);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      const endTime = Date.now();
      const latency = endTime - startTime;

      console.log('Transaction hash:', receipt.transactionHash);
      console.log('Latency:', latency, 'ms');
    }
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