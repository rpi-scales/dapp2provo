### PROV-O to Neo4j transpiler using a file drag-and-drop. 
It runs on localhost:9966, and works by pasting in a text file of PROV syntax (assuming the syntax is correct). "infile.txt" was taken from https://www.w3.org/TR/prov-o/, example 1.
- 1 terminal window running your neo4j shell:
`bin/neo4j console` inside your installed neo4j directory
- 1 terminal window running your local web server:
`npm start`

To view the results of your Provenance graph, navigate to localhost:7474 and run 
`MATCH (n) RETURN n`
If it's your first time launching neo4j on your computer, you'll need to generate a fresh password.

#### To run this, you'll need:
1. Node (check with ```node -v```) and npm (`npm install`)
2. Neo4j Server installed somewhere on your system for running the graph server (https://neo4j.com/download-center/#community). This version was created with v3.5.3
3. Neo4j JavaScript driver (v1.7 is the stablerelease) ```npm install neo4j-driver```
4. XML-HTTP-REQUEST driver `npm install --save xmlhttprequest`


<!-- 1. Node (check with ```node -v```)
2. Truffle (```npm install -g truffle```)
3. Ganache
4. Metamask (Chrome Browser Extension)
5. Solidity Syntax Highlighter in IDE of your choice.
--------
6. Neo4j Server installed (separately somewhere on your system) for running the graph server (https://neo4j.com/download-center/#community)
7. Neo4j JavaScript driver (```npm install neo4j-driver```) is already installed in this repo. -->
<!-- 
### Backend - Run Steps
1. Have Ganache running / launched 
2. ```truffle migrate``` to compile the app
3. Terminal window 1: run ```truffle migrate --reset``` every time a ".sol" is modified to reset the state of local blockchain
4. Window 2: ```npm run dev``` to start the Lite server for hosting the frontend application
-------
5. Window 3: navigate to root of installed neo4j folder and run ```bin\neo4j console```. Database console can be viewed at localhost:7474
6. First time install will be prompted for neo4j login and password change -  username&password are "neo4j". 
Reset just the pw to "neo4j123" once inside

### Frontend - Run Steps
1. npm run dev should launch the browser, and a voting page should be viewable
2. Import an account with Metamask using a private key, and paste a key from your list of truffle accounts. Use an account
that hasn't previously voted or hashed with this application
3. Add Custom RPC server with Metamask. Paste the address of your ganache console to RPC url, using symbol ETH
4. Try refreshing page or running ```truffle migrate --reset``` again if page doesn't load or show any content

### Issue I'm having currently:
- Excluding the neo4j steps (commented out currently), the sample voting app should work. 
- I'm trying to import the neo4j driver at the top of App.js, and invoke neo4j calls in the "castVote" function, lines 117-141 of app.js
- Trying to figure out how to import the driver with current structure of app.js
- This is building off of the election sample app https://github.com/dappuniversity/election/tree/2019_update  -->