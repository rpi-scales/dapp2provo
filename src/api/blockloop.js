const express = require('express');
const router = express.Router();
const { creds } = require('./../../config/default');
// const chainModel = require('./../model/chainModel');
const blockloopModel = require('./../model/blockloopModel');
const fetch = require('node-fetch');

//Create first block (the starting point from which all future blocks are derived from)
let derived_from = 0;

setInterval(loop_thru_block, 20000);

async function loop_thru_block() {
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
  			block_hash: data.result.hash,
  			parent_hash: data.result.parentHash,
  			prior_block: parseInt(data.result.size)-1

  		}

  		let step1 = await blockloopModel.mergeBlock(options);

  		for (let i = 0; i < options.num_transactions; i++) {
  				console.log("Output transaction for loop")

  			if (data.result.transactions[i].input == "0x" || data.result.transactions[i].gas == "0x5208" ) { 	// standard transaction
				//write file for transaction;
  				console.log("if block")

				let step2 = await blockloopModel.outputTransaction({...data.result.transactions[i], ...options});
			}
			else if (data.result.transactions[i].input != "0x" && data.result.transactions[i].gas != "0x5208") {
				//assume it's a contract!
  				console.log("else block")
				let step2 = await blockloopModel.outputContract({...data.result.transactions[i], ...options});
			}
		}

  		console.log("MINER:", options.miner)
  		console.log("num_transactions:", options.num_transactions)
  		console.log("Block Height:", options.height)
  		console.log("Difficulty:", options.difficulty)

  		// let test_blockchain = await chainModel.graph_test(options);

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

module.exports = router;