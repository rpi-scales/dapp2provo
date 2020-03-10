# Setup:
- ```npm install```
- ```npm install neo4j-driver```
- ```npm install express```
- ```npm install --save node-fetch```
- ```npm install web3```
- ```npm install -g http-server```

# Dependencies:
- Ensure Neo4j Server installed somewhere on your system for running the graph server (https://neo4j.com/download-center/#community). 
- Make sure when you create your Neo4j password, you update it in config>default.js

# Run:
- Start Neo4j server: In terminal window, navigate to root of your neo4j community edition and run ```bin/neo4j console```
e.g. ```My-MacBook-Pro:neo4j-community-3.5.3 me$ bin neo4j/console```
- In a new terminal, at the root of this project, run ```node app.js```. Output should start printing in the console, and a graph will start to populate in your backend Neo4j server, which you can view by navigating to localhost:7474 and typing in ```match (n) return n```

# View on Public IP:
- A sample neo4j instance is available for viewing at http://3.16.111.243:7474/browser/ (if prompted, check boxnote for password)
- Contract bytecode from the contract input on 