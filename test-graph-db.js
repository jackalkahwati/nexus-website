// Simple test script for the local graph database
const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;

// Define paths to database files
const DB_PATH = path.join(__dirname, '.local-graph-db');
const NODES_FILE = path.join(DB_PATH, 'nodes.json');
const RELS_FILE = path.join(DB_PATH, 'relationships.json');

// Test flag file
const TEST_FLAG_FILE = path.join(__dirname, '.use-local-db');

console.log('=== Local Graph Database Test ===');

// Test 1: Check if database directory exists
try {
  const dbExists = fs.existsSync(DB_PATH);
  assert.equal(dbExists, true, 'Database directory should exist');
  console.log('✓ Test 1: Database directory exists');
} catch (error) {
  console.error('✗ Test 1 failed:', error.message);
  process.exit(1);
}

// Test 2: Check if node and relationship files exist
try {
  const nodesExist = fs.existsSync(NODES_FILE);
  const relsExist = fs.existsSync(RELS_FILE);
  assert.equal(nodesExist, true, 'Nodes file should exist');
  assert.equal(relsExist, true, 'Relationships file should exist');
  console.log('✓ Test 2: Database files exist');
} catch (error) {
  console.error('✗ Test 2 failed:', error.message);
  process.exit(1);
}

// Test 3: Check if nodes file contains valid JSON
try {
  const nodesData = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
  assert(Array.isArray(nodesData), 'Nodes data should be an array');
  assert(nodesData.length > 0, 'Nodes data should not be empty');
  console.log(`✓ Test 3: Nodes file contains ${nodesData.length} nodes`);
} catch (error) {
  console.error('✗ Test 3 failed:', error.message);
  process.exit(1);
}

// Test 4: Check if relationships file contains valid JSON
try {
  const relsData = JSON.parse(fs.readFileSync(RELS_FILE, 'utf8'));
  assert(Array.isArray(relsData), 'Relationships data should be an array');
  assert(relsData.length > 0, 'Relationships data should not be empty');
  console.log(`✓ Test 4: Relationships file contains ${relsData.length} relationships`);
} catch (error) {
  console.error('✗ Test 4 failed:', error.message);
  process.exit(1);
}

// Test 5: Verify node structure
try {
  const nodesData = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
  const sampleNode = nodesData[0];
  assert(sampleNode.identity, 'Node should have an identity');
  assert(Array.isArray(sampleNode.labels), 'Node should have labels array');
  assert(sampleNode.properties, 'Node should have properties');
  console.log('✓ Test 5: Node structure is valid');
} catch (error) {
  console.error('✗ Test 5 failed:', error.message);
  process.exit(1);
}

// Test 6: Verify relationship structure
try {
  const relsData = JSON.parse(fs.readFileSync(RELS_FILE, 'utf8'));
  const sampleRel = relsData[0];
  assert(sampleRel.identity, 'Relationship should have an identity');
  assert(sampleRel.type, 'Relationship should have a type');
  assert(sampleRel.start, 'Relationship should have a start node');
  assert(sampleRel.end, 'Relationship should have an end node');
  assert(sampleRel.properties !== undefined, 'Relationship should have properties');
  console.log('✓ Test 6: Relationship structure is valid');
} catch (error) {
  console.error('✗ Test 6 failed:', error.message);
  process.exit(1);
}

// Test 7: Verify node references in relationships
try {
  const nodesData = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
  const relsData = JSON.parse(fs.readFileSync(RELS_FILE, 'utf8'));
  
  // Create a set of node IDs
  const nodeIds = new Set(nodesData.map(node => node.identity));
  
  // Check if all relationships reference existing nodes
  let validRefs = true;
  for (const rel of relsData) {
    if (!nodeIds.has(rel.start) || !nodeIds.has(rel.end)) {
      validRefs = false;
      console.error(`Invalid relationship ${rel.identity}: ${rel.start} -> ${rel.end}`);
      break;
    }
  }
  
  assert(validRefs, 'All relationships should reference existing nodes');
  console.log('✓ Test 7: Relationship references are valid');
} catch (error) {
  console.error('✗ Test 7 failed:', error.message);
  process.exit(1);
}

// Test 8: Create test flag file
try {
  fs.writeFileSync(TEST_FLAG_FILE, 'true', 'utf8');
  assert(fs.existsSync(TEST_FLAG_FILE), 'Test flag file should exist');
  console.log('✓ Test 8: Test flag file created');
} catch (error) {
  console.error('✗ Test 8 failed:', error.message);
  process.exit(1);
}

console.log('\n=== All tests passed! ===');
console.log('The local graph database is working correctly.');
console.log('\nYou can now use the test API server to explore the data:');
console.log('  npm run test:api');
console.log('\nOr you can run the Next.js development server:');
console.log('  npm run dev');