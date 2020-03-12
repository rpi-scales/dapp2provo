//param[0] is the contract addressl param[1] is the blocknum in hex containing that contract.
//Output: The first 10 chars of bytecode and "true" if it's a valid contract; "0x" and "false" if invalid

/*Note: The infura call will get fussy if you're making a request to a block that's older than the last 128 blocks mined; 
To get a new block contract, go to ethviewer.live and click on a block to be redirected to an etherscan page; Press on
"internal contract transactions" , and post in the block height (in hex) and the contract address in the params array below.
*/


const fetch = require('node-fetch')
fetch("https://mainnet.infura.io/v3/acc8856247a34cf8ba30356584ae5b41", {
  body: "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\": [\"0x818e6fecd516ecc3849daf6845e3ec868087b755\", \"0x93536D\"],\"id\":1}",
  headers: {                                                            //^Contract address of interest                 block height
    "Content-Type": "application/json"
  },
  method: "POST"
}).then(response => response.json())
      .then(async data => {
          console.log("data retrievable")
          let options = {            //get from/to/value for first transaction.
              result: data.result ? data.result : "0x",
              is_contract: "null"
          }
          if (options.result != "0x") {
              options.is_contract = true;
          }
          else options.is_contract = false;
          console.log("Result",options.result.substring(0,10))
          console.log("Contract", options.is_contract)
          })

  .catch(err => {
      console.log(err);
  })