// Script to monitor the local database files for changes
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '.local-graph-db');
const NODES_FILE = path.join(DB_PATH, 'nodes.json');
const RELS_FILE = path.join(DB_PATH, 'relationships.json');

// Initial file stats
let nodesLastMod = fs.statSync(NODES_FILE).mtime.getTime();
let relsLastMod = fs.statSync(RELS_FILE).mtime.getTime();
let nodeSize = fs.statSync(NODES_FILE).size;
let relSize = fs.statSync(RELS_FILE).size;

console.log('Monitoring local database files for changes...');
console.log(`Initial nodes.json: ${new Date(nodesLastMod).toISOString()} (${nodeSize} bytes)`);
console.log(`Initial relationships.json: ${new Date(relsLastMod).toISOString()} (${relSize} bytes)`);

// Function to check file stats
function checkFiles() {
  try {
    const currentNodesLastMod = fs.statSync(NODES_FILE).mtime.getTime();
    const currentRelsLastMod = fs.statSync(RELS_FILE).mtime.getTime();
    const currentNodeSize = fs.statSync(NODES_FILE).size;
    const currentRelSize = fs.statSync(RELS_FILE).size;
    
    // Check for changes
    if (currentNodesLastMod !== nodesLastMod || currentNodeSize !== nodeSize) {
      console.log(`[${new Date().toISOString()}] nodes.json changed: ${new Date(currentNodesLastMod).toISOString()} (${currentNodeSize} bytes)`);
      nodesLastMod = currentNodesLastMod;
      nodeSize = currentNodeSize;
    }
    
    if (currentRelsLastMod !== relsLastMod || currentRelSize !== relSize) {
      console.log(`[${new Date().toISOString()}] relationships.json changed: ${new Date(currentRelsLastMod).toISOString()} (${currentRelSize} bytes)`);
      relsLastMod = currentRelsLastMod;
      relSize = currentRelSize;
    }
  } catch (error) {
    console.error(`Error checking files: ${error.message}`);
  }
}

// Monitor files every second
setInterval(checkFiles, 1000);