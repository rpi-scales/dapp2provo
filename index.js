const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "neo4j"));  //Or whatever your neo4j credentials are
const session = driver.session()
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const input = document.querySelector('input[type="file"]')
input.addEventListener('change', function (e) {
  console.log(input.files)
  const reader = new FileReader()
  reader.onload = function () {
    const text_blob = reader.result
    separateChunks(text_blob);
    // const lines = reader.result.split('\n.').map(function (line) {
    //  return line.split(';')
    // })
    console.log(lines)
    console.log(lines.size)
  }
  reader.readAsText(input.files[0])
}, false) 
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
        if (lines[j].includes("prov:Activity")) {
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
        if (lines[j].includes("prov:Agent")) {
          current_chunk = "Agent";
          current_name=lines[j-1].trim()
          let options = {
              label: current_chunk,
              name: current_name
          }
          build_nodes(options);
          console.log("built a prov agent")
            if (lines[j].includes("a foaf")){
              let subclass_split = lines[j].split(':')
              let subclass_split2 = subclass_split[1].split(',')
              options.property= "subclass";
              options.value = subclass_split2[0];   //The first part of this split is the desired subclass of our "foaf"
              set_props(options)
              // if (lines.length > 2) {     // Lines with "," should only be contained in the first line of a prov "Chunk"
              //   lines[j] = lines[j+1]       //advance to the next line if the chunk size is big enough (no 'seg-faults' will occur)
              // }
            }

        }
        if (lines[j].includes("prov:Entity")) {
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
            let trimmed_line = lines[j].replace(/\s+/g,' ').trim();
            let trim_line_array = trimmed_line.split(' ')
            let part1 = trim_line_array[0]
            let part2 = trim_line_array[1].slice(0,-1)

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

        if (current_chunk === "Agent") {
          console.log("lines at j" , lines[j])
            let trimmed_line = lines[j].replace(/\s+/g,' ').trim();   // remove extra spaces between words in a line
            let trim_line_array = trimmed_line.split(' ')
            let part1 = trim_line_array[0]
            console.log(part1)
            console.log(trim_line_array[0])
            let part2 = trim_line_array[1].slice(0,-1)              //trim off ";" so isn't included in node props.
            if (part1.includes("actedOnBehalfOf")) {
                let options = {
                  label: current_chunk,
                  name: current_name,
                  relationship: "actedOnBehalfOf",
                  label2: "Agent",
                  value: part2
                }
                create_rels(options)
              }
            else if (part1.includes("foaf")){
                let foaf_array = part1.split(':')
                let options = {
                  label: current_chunk,
                  name: current_name,
                  property: foaf_array[1],
                  label2: "Agent",
                  value: part2
                }
                set_props(options)
              }

        }   //end "IF Agent"
        if (current_chunk === "Entity") {
            let trimmed_line = lines[j].replace(/\s+/g,' ').trim();   // remove extra spaces between words in a line
            let trim_line_array = trimmed_line.split(' ')
            let part1 = trim_line_array[0]
            let part2 = trim_line_array[1].slice(0,-1)  //to remove the "semi-colon's"
            if (part1.includes("wasAttributedTo")) {
                let options = {
                  label: current_chunk,
                  name: current_name,
                  relationship: "wasAttributedTo",
                  label2: "Agent",
                  value: part2
                }
                create_rels(options)
            }

            if (part1.includes("wasGeneratedBy")){
                let options = {
                  label: current_chunk,
                  name: current_name,
                  relationship: "wasGeneratedBy",
                  label2: "Activity",
                  value: part2
                }
                create_rels(options)
            }
        
            if (part1.includes("wasDerivedFrom")) {
                let options = {
                  label: current_chunk,
                  name: current_name,
                  relationship: "wasDerivedFrom",
                  label2: "Entity",
                  value: part2
                }
                create_rels(options)
            }
          }   
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
      // console.log("testing");
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
      // console.log("testing");
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
    });
    session.close();
  })
  .catch(function (error) {
    console.log(error);
  });
}



// readTextFile('file:///Users/dan/Projects/bigbase/n4jprov/infile.txt')
// console.log(allText)
