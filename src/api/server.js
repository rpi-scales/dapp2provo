const express = require('express');
const router = express.Router();
let http=require("http");  
const fetch = require('node-fetch');

const fs = require('fs') 
let bytecode_file = 'bytecode.txt';
const rpcURL = "mainnet.infura.io/v3/acc8856247a34cf8ba30356584ae5b41"
let Web3 = require('web3');
let web3 = new Web3(
  new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/acc8856247a34cf8ba30356584ae5b41")
  //new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/acc8856247a34cf8ba30356584ae5b41")
);

fs.writeFile(bytecode_file, '', function(){console.log('')})
//https://api.etherscan.io/api?module=contract&action=getsourcecode&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken 

// fs.writeFile(bytecode_file, '', function(){console.log('')})

display_code()

async function display_code() { 
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        // window.web3 = new Web3(web3.currentProvider);
    }
    console.log("line26server")
    let string = web3.eth.getCode("0xd26114cd6EE289AccF82350c8d8487fedB8A0C07");
    console.log("line28server")
    string.then((result) => {
    console.log("THE RESRULT IS",result);
    let server = http.createServer(function(request, response) {  
    response.writeHead(200, {  
        'Content-Type': 'text/plain'  
    }); 
    
    response.write(result); 
    response.end();  
});
        fs.writeFileSync(bytecode_file, result+"\n", {flag:'a'});
        server.listen(8080); 
        
        });


// let server = http.createServer(function(request, response) {  
//     response.writeHead(200, {  
//         'Content-Type': 'text/plain'  
//     }); 
    
//     let j = 1000
//     response.write("This is Test Message from server.js.\n"+j); 
//     response.end();  
// }); 


// server.listen(8080); 
return;

}

module.exports = router;
