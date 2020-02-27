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
fs.writeFile(bytecode_file, '', function(){console.log('')})

exports.graph_test = async function(options) {
    let session = driver.session();

    let result = await session.run('MERGE (a:account {address: $from}) MERGE (b:account {address: $to}) MERGE (c:account {address: $miner}) MERGE (c)-[:MINED]->(d:block {height: $height, difficulty: $difficulty})-[:FACILITATED]->(a)-[:SENT {value: $value}]->(b) return a', {
       	miner: options.miner,
		height: options.height,
		difficulty: options.difficulty,
		// num_transactions: options.num_transactions,
		from: options.from,
		to: options.to,
		value: options.value,

    });
    
    session.close();
    if (result.records.length >0) {
    	// console.log(`${options.from} sent ${options.amount} ETH to ${options.to}`)
    	// let string = `${options.from} sent ${options.amount} ETH to ${options.to}`

    	let string = `${options.miner} mined block ${options.height} which FACILITATED ${options.from} sent ${options.value} ETH to ${options.to}`
  			
    	fs.writeFileSync(output_file, string+"\n", {flag:'a'});

    	// fs.writeFileSync(output_file, percent_arr[i][0]+"\t"+percent_arr[i][1]+"\n\t\n", {flag:'a'});
    	return result.records[0].get(0).properties.address;

    }

    return false;
}

exports.print_bytecode = async function(options) {      //do nothing
//https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetcode
// console.log("web3",web3);
if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        // window.web3 = new Web3(web3.currentProvider);
    }
console.log("HELLO")
// let string = web3.eth.getCode(options.contract_addr, function(error, result) {
//     if(!error) {
//         console.log("error");
//     }
//     else {
//         console.log("hi hi")
//     }
// });
    let string = web3.eth.getCode("0xd26114cd6EE289AccF82350c8d8487fedB8A0C07");
    string.then((result) => {
        console.log(result);
        fs.writeFileSync(bytecode_file, result+"\n", {flag:'a'});
        });
    // console.log(JSON.stringify(string))
    // fs.writeFileSync(bytecode_file, string+"\n", {flag:'a'});

}

exports.print_last_transaction = async function(options) {      //do nothing


    let session = driver.session();
    let result = await session.run(' ', {
        

    });
    //result.records[0].get(0).properties.prop = ;
    session.close();
    console.log(result.records)
    return !result.records.length;
}
exports.print_last_transaction = async function(options) {      //do nothing


    let session = driver.session();
    //DO Payment API with Token. Await Confirmation*******************
    let result = await session.run(' ', {
        

    });
    //result.records[0].get(0).properties.prop = ;
    session.close();
    console.log(result.records)
    return !result.records.length;
}