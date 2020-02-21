const express = require('express');
const router = express.Router();
const { creds } = require('./../../config/default');
let count=0;
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// const _ = require('lodash');
const chainModel = require('./../model/chainModel');
const fetch = require('node-fetch');

//setInterval(blockchain_test, 7000);
print_bytecode();


async function print_bytecode() {
  let options = {
    contract_addr: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07" //0xef3fbc3e228dbdc523ce5e58530874005553eb2e
                                                                 //0xd26114cd6EE289AccF82350c8d8487fedB8A0C07
                                                                //0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8
 //https://etherscan.io/address/0xd26114cd6EE289AccF82350c8d8487fedB8A0C07#code   yields visible code                                                            

  }
  if (count <= 1) { 
    let result = await chainModel.print_bytecode(options);
    count++;
  }
  
  
}

async function print_test() {
	console.log("hi")
	let options = {
		from: "100",
		to: "500",
		amount: 7.01012
	}
	let test_transaction = await chainModel.graph_test(options);

	return true;
	// res.status(200).json({
 //    	transaction: test_transaction
 //  });
};

async function blockchain_test() {
  console.log("still running")
	let data;
  let key = creds.etherscan.api_key;

  fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=latest&boolean=true&apikey=${key}`)
  	.then(response => response.json())
  	.then(async data => {
  		console.log("data retrievable")
  		let options = {			//get from/to/value for first transaction.
  			miner: data.result.miner,
  			height: parseInt(data.result.size),
  			difficulty: parseInt(data.result.difficulty),
  			num_transactions: data.result.transactions.length,
  			from: data.result.transactions[0].from,
  			to: data.result.transactions[0].to,
  			value: parseInt(data.result.transactions[0].value)
  		}
  		console.log("MINER:", options.miner)
  		console.log("num_transactions:", options.num_transactions)
  		console.log("Block Height:", options.height)
  		console.log("Difficulty:", options.difficulty)

  		let test_blockchain = await chainModel.graph_test(options);

    	// console.log(data)
  		})

  .catch(err => {
  	console.log(err);
  })
	// let test_transaction = await chainModel.graph_test(options);

	return true;
	// res.status(200).json({
 //    	transaction: test_transaction
 //  });
};




router.post('/', async (req, res) => {


	

	


  res.status(200).json({
    user: await chainModel.print_last_transaction(req.body)
  });
});


module.exports = router;
