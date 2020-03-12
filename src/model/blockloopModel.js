const { creds } = require('./../../config/default');
let neo4j = require('neo4j-driver');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.database.username, creds.database.password));
let output_file = 'Output.txt';
let bytecode_file = 'bytecode.txt';
const rpcURL = "mainnet.infura.io/v3/acc8856247a34cf8ba30356584ae5b41"
let Web3 = require('web3');
// const web3 = new Web3(Web3.givenProvider || rpcURL);
let web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/v3/acc8856247a34cf8ba30356584ae5b41")
  //new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/acc8856247a34cf8ba30356584ae5b41")
);
const fs = require('fs') 
fs.writeFile(output_file, '', function(){console.log('Program Starting...\n')})
fs.writeFile(bytecode_file, '', function(){console.log('')})//clear out the existing file

exports.mergeBlock = async function(options){
	let string = `:block${options.height}\n\t a prov:Entity;\n\t foaf:blockHash: ${options.hash};\n\t foaf:miner ${options.miner};\n\t prov:wasDerivedFrom :block${options.prior_block};`
// let string = `${options.miner} mined block ${options.height} which FACILITATED ${options.from} sent ${options.value} ETH to ${options.to}`
  	// for (let i = 0; i < ) { 	//if we're doing "prov:wasGeneratedBy for every single txn in the block from the start"
  	//create miner agent;

	fs.writeFileSync(output_file, string+"\n"+".\n", {flag:'a'});

}

exports.outputTransaction = async function(transaction) {
	console.log("Output transactionmodel")
	let string = `:transaction${transaction.hash.substring(0,15)}\n\t a prov:Activity;\n\t prov:generated :block${transaction.height}\n\t foaf:value ${parseInt(transaction.value)};\n\t prov:wasStartedBy :senderAgent${transaction.from.substring(0,10)}\n\t prov:wasEndedBy :receiverAgent${transaction.to.substring(0,10)}\n`
	fs.writeFileSync(output_file, string+"\n"+".\n", {flag:'a'});
//create the sender and receiver agents!
}

exports.outputContract = async function(transaction) {

console.log("Output Contract fxn not created yet")
}