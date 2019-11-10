const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "neo4j123"));
const session = driver.session()
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const fs = require('fs') 
let allText = '' 
let bigarray = []
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                separateChunks(allText);
                // bigarray.push[allText]
                // console.log(allText);
            }
        }
    }
    rawFile.send(null);
}
function separateChunks(text_blob){
    var chunks = text_blob.split('\n.') //chunks is now an array of all the strings inside the chunk
    let numact= 0;
    let chunk_counter = 0;
    
    for (i in chunks) {
      console.log("chunk", chunk_counter)
      chunk_counter++;
      // console.log(chunks[i])
      let current_chunk = ''
      let current_name = ' '
      var lines = chunks[i].split('\n') // lines is now an array of all the string-LINES inside the chunk
      let line_counter = 0;
      for(j in lines){
        console.log("line", line_counter)
        line_counter++;
        // console.log(lines[j]);                  //prints everything
        if (lines[j].includes("a prov:Activity")) {
          current_chunk = "Activity";
          current_name=lines[j-1].trim()
          // console.log(chunks[i])
          // console.log(current_name)
          // ++numact;
          // console.log(current_chunk);
          let options = {
            label: current_chunk,
            name: current_name
          }
          build_nodes(options);
          console.log("built a prov Activity")
        }
        if (lines[j].includes("a prov:Agent")) {
          current_chunk = "Agent";
          current_name=lines[j-1].trim()
          let options = {
              label: current_chunk,
              name: current_name
          }
          build_nodes(options);
          console.log("built a prov agent")
        }
        if (lines[j].includes("a prov:Entity")) {
          current_chunk = "Entity";
          current_name=lines[j-1].trim()
          let options = {
            label: current_chunk,
            name: current_name
          }
          build_nodes(options);
          console.log("built a prov entity")
        }
//Activity Functions
        if (current_chunk === "Activity") {
            // console.log("Jar")
            let trimmed_line = lines[j].replace(/\s+/g,' ').trim();
            console.log("trimmed_line: ", trimmed_line)
            let trim_line_array = trimmed_line.split(' ')
            console.log("trim_line_array: ", trim_line_array)
            let part1 = trim_line_array[0]
            console.log("part1: ", part1)
            let part2 = trim_line_array[1]
            console.log("part2 ", part2)

            if (part1.includes("startedAtTime")) {
                let options = {
                  label: current_chunk,
                  name: current_name,
                  property: "startedAtTime",
                  value: part2
                }
                set_props(options)
              // match (a:current_chunk {name: $current_name}) set a.startedAtTime = "second part of line j"
            }
            
            else if (part1.includes("endedAtTime")) {
              let options = {
                  label: current_chunk,
                  name: current_name,
                  property: "endedAtTime",
                  value: part2
                }
                set_props(options)
            }

            else if (part1.includes("wasAssociatedWith")){
              // match (a:current_chunk {name: $current_name}) merge (a)-[wasAssociatedWith]->(b:Agent {name of second part of line j)"
              let options = {
                  label: current_chunk,
                  name: current_name.trim(),
                  relationship: "wasAssociatedWith",
                  label2: "Agent",
                  value: part2
                }
                create_rels(options)
              
            }

            else if (part1.includes("used")) {
              // match (a:current_chunk {name: $current_name}) merge (a)-[used]->(b:Entity {with name of second part of line j)"
               let options = {
                  label: current_chunk,
                  name: current_name,
                  relationship: "used",
                  label2: "Entity",
                  value: part2
                }
                create_rels(options)
            }

            else if (part1.includes("wasInformedBy")) {
               let options = {
                  label: current_chunk,
                  name: current_name,
                  relationship: "wasInformedBy",
                  label2: "Activity",
                  value: part2
                }
                create_rels(options)
              // match (a:current_chunk {name: $current_name}) merge (a)-[wasInformedBy]->(b:Activity {with name of second part of line j)"
            }
        
        } //close out "if Activity"

      }
    }
    // console.log('Number of Activities:', numact);
    

} 

//end sepchunk function
function create_rels(options){
  session.run(`MERGE (a:${options.label} {name: $name}) MERGE (b:${options.label2} {name: $name2}) CREATE (a)-[:${options.relationship}]->(b) return a`,
   // session.run(`MERGE (a:${options.label} {name: $name})-[:${options.relationship}]->(b:${options.label2} {name: $name2}) return a`, 
      {
        name: options.name,
        rel: options.relationship,
        name2: options.value,       //want to set as the name/"property" of receiving node as the second part of the given line

      }).then(function (result) {
    result.records.forEach(function (record) {
      console.log("testing");
    });
    session.close();
  })
  .catch(function (error) {
    console.log(error);
  });
}

function build_nodes(options){
   session.run(`MERGE (a:${options.label} {name: $name}) return a`, 
      {
        name: options.name,

      }).then(function (result) {
    result.records.forEach(function (record) {
      console.log("testing");
    });
    session.close();
  })
  .catch(function (error) {
    console.log(error);
  });
}
// match (a:current_chunk {name: $current_name}) set a.startedAtTime = "second part of line j"
function set_props(options){
   session.run(`MATCH (a:${options.label} {name: $name}) set a.${options.property}=$value return a`, 
      {
        name: options.name,
        property: options.property,
        value: options.value

      }).then(function (result) {
    result.records.forEach(function (record) {
      console.log("testing");
    });
    session.close();
  })
  .catch(function (error) {
    console.log(error);
  });
}






readTextFile('file:///Users/dan/Projects/bigbase/n4jprov/infile.txt')
// console.log(allText)



// const resultPromise = session.writeTransaction(tx =>
//   tx.run(
//     'CREATE (a:test) SET a.message = $message RETURN a.message + ", from node " + id(a)',
//     { message: 'hello, world' }
//   )
// )

// resultPromise.then(result => {
//   session.close()

//   const singleRecord = result.records[0]
//   const greeting = singleRecord.get(0)

//   console.log(greeting)

//   // on application exit:
//   driver.close()






// function build_nodes(options){
//     console.log("hi")
//     console.log('first call', options)
//     const resultPromise = session.writeTransaction(tx =>
//       tx.run(
//         `MERGE (a:${options.label} {name: $name})`,
//         { 
//           label: options.label,
//           name: options.name, 
//         }
//       )
//     )
//     console.log('2nd part', options)
//     resultPromise.then(result => {
//       session.close()
//       // console.log(result.records[0].singleRecord.get(0))
//       const singleRecord = result.records[0]
//       const greeting = singleRecord.get(0)

//       // console.log(greeting)

//       // on application exit:
//       driver.close()
//       return 0
//     })
//     return 1
// }
// })