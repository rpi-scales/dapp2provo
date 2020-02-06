const { creds } = require('./../../config/default');
let neo4j = require('neo4j-driver');
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.database.username, creds.database.password));
let output_file = 'Output.txt';
const fs = require('fs') 
fs.writeFile(output_file, '', function(){console.log('Program Starting...\n')})

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