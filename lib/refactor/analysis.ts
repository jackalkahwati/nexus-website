import * as parser from '@typescript-eslint/typescript-estree';
import { Session, Transaction } from 'neo4j-driver';
import { TSESTree } from '@typescript-eslint/typescript-estree';
import { getSession } from './neo4j';

// Use the Neo4j session from the main neo4j.ts file
export function getNeo4jSession(): Session {
  return getSession();
}

// --- AST Parsing ---

export async function parseCode(code: string, filePath: string) {
  try {
    const ast = parser.parse(code, {
      loc: true, // Include line and column numbers
      range: true, // Include character ranges
      comment: true, // Include comments
      tokens: false, // Don't include tokens for performance unless needed
      ecmaVersion: 'latest', // Use the latest ECMAScript version
      sourceType: 'module', // Assume ES modules
      // jsx: true, // Enable if you need to parse JSX/TSX - consider adding based on file extension
      filePath: filePath, // Helpful for error messages
    });
    console.log(`Successfully parsed: ${filePath}`);
    return ast;
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    throw new Error(`Failed to parse ${filePath}`);
  }
}

// --- Graph Population ---

// Helper to extract identifier name safely
function getIdentifierName(node: TSESTree.Node | null | undefined): string | null {
  if (node && node.type === TSESTree.AST_NODE_TYPES.Identifier) {
    return node.name;
  }
  // Handle MemberExpression (e.g., console.log)
  if (node && node.type === TSESTree.AST_NODE_TYPES.MemberExpression && node.property.type === TSESTree.AST_NODE_TYPES.Identifier) {
      // This gives the last part (e.g., 'log' from 'console.log')
      // A more sophisticated approach might capture the full chain (console.log)
      return node.property.name;
  }
  return null;
}

/**
 * Populates the Neo4j graph based on the parsed AST.
 */
export async function populateGraphFromAst(session: Session, ast: TSESTree.Program, filePath: string, projectId: string) {
  console.log(`Populating graph for file: ${filePath} (Project: ${projectId})`);

  const fileData = { filePath, projectId };

  // Use a single transaction for efficiency
  await session.writeTransaction(async (tx) => {
    // MERGE File node
    const fileResult = await tx.run(
      'MERGE (f:File {path: $filePath, projectId: $projectId}) RETURN id(f) as fileNodeId',
      fileData
    );
    const fileNodeId = fileResult.records[0]?.get('fileNodeId');
    if (!fileNodeId) {
      throw new Error(`Could not create or find File node for ${filePath}`);
    }
    console.log(`Using File node ID: ${fileNodeId}`);

    // Store nodes to create relationships later if needed (e.g., calls)
    const createdNodes = new Map<string, any>(); // key: unique identifier, value: node properties
    const callRelationshipsToCreate: { callerId: string, calleeName: string, line: number }[] = [];

    // Visitor logic
    traverseAst(ast, {
      FunctionDeclaration: (node: TSESTree.FunctionDeclaration, parent) => {
        const funcName = getIdentifierName(node.id) || `anonymous@${node.loc.start.line}`;
        const uniqueId = `${filePath}#${funcName}:${node.loc.start.line}`;
        const nodeProps = {
          ...fileData,
          name: funcName,
          type: 'Function',
          startLine: node.loc.start.line,
          startCol: node.loc.start.column,
          endLine: node.loc.end.line,
          endCol: node.loc.end.column,
          params: node.params.map(getIdentifierName).filter(Boolean).join(', '), // Store params as string
          async: node.async,
          generator: node.generator,
          uniqueId: uniqueId,
        };
        createdNodes.set(uniqueId, { label: 'Function', props: nodeProps });

        // Create node and link to File
        tx.run(
          `MATCH (f:File {path: $filePath, projectId: $projectId})
           MERGE (fn:Function {uniqueId: $uniqueId})
           ON CREATE SET fn = $props
           ON MATCH SET fn += $props // Update properties if node exists
           MERGE (f)-[:CONTAINS]->(fn)`,
          { ...fileData, uniqueId: nodeProps.uniqueId, props: nodeProps }
        );
        console.log(`  Created/Merged Function: ${funcName}`);
      },

      ClassDeclaration: (node: TSESTree.ClassDeclaration, parent) => {
        const className = getIdentifierName(node.id) || `AnonymousClass@${node.loc.start.line}`;
        const uniqueId = `${filePath}#${className}:${node.loc.start.line}`;
        const nodeProps = {
          ...fileData,
          name: className,
          type: 'Class',
          startLine: node.loc.start.line,
          startCol: node.loc.start.column,
          endLine: node.loc.end.line,
          endCol: node.loc.end.column,
          uniqueId: uniqueId,
          // TODO: Handle superclass, implements
        };
        createdNodes.set(uniqueId, { label: 'Class', props: nodeProps });

        tx.run(
          `MATCH (f:File {path: $filePath, projectId: $projectId})
           MERGE (c:Class {uniqueId: $uniqueId})
           ON CREATE SET c = $props
           ON MATCH SET c += $props
           MERGE (f)-[:CONTAINS]->(c)`,
          { ...fileData, uniqueId: nodeProps.uniqueId, props: nodeProps }
        );
        console.log(`  Created/Merged Class: ${className}`);
        // TODO: Traverse class body for methods (MethodDefinition)
      },

      CallExpression: (node: TSESTree.CallExpression, parent: TSESTree.Node | undefined) => {
        const calleeName = getIdentifierName(node.callee);
        if (calleeName) {
          // --- Find Caller (Placeholder - Requires robust scope tracking) ---
          // let callerUniqueId: string | null = null;
          // try {
          //   const parentFuncOrMethod = findParentNode(node, parent, n =>
          //     n.type === TSESTree.AST_NODE_TYPES.FunctionDeclaration ||
          //     n.type === TSESTree.AST_NODE_TYPES.MethodDefinition
          //   );
          //   if (parentFuncOrMethod) {
          //      const callerName = getIdentifierName((parentFuncOrMethod as any).id || (parentFuncOrMethod as any).key);
          //      callerUniqueId = `${filePath}#${callerName}:${parentFuncOrMethod.loc.start.line}`;
          //   }
          // } catch (e) { console.error("Error finding parent for call:", e); }
          // --- End Find Caller Placeholder ---

          // For now, let's assume the call originates directly from the file
          // A better approach needs scope resolution
          const callerUniqueId = `${filePath}#`; // Simplified: Represents the file itself as caller

          if(callerUniqueId) {
             console.log(`  Detected call to ${calleeName} at L${node.loc.start.line}`);
             // Queue relationship creation
             callRelationshipsToCreate.push({
                 callerId: callerUniqueId, // Use the simplified file ID for now
                 calleeName: calleeName,
                 line: node.loc.start.line
             });
          }
        }
      }

      // TODO: Add visitors for Imports, Exports, Variables, MethodDefinition, ArrowFunctionExpression, etc.
    });

    console.log('Processing potential CALLS relationships...');
    // Process queued CALLS relationships
    for (const call of callRelationshipsToCreate) {
        // This MERGE tries to connect the simplified caller (File) to a Function/Method with the calleeName.
        // WARNING: This is inaccurate without scope resolution. It might create relationships to functions
        // with the same name in different files or scopes.
        tx.run(`
            MATCH (caller {uniqueId: $callerId}) // Match the simplified caller (File or placeholder)
            MATCH (callee:Function {name: $calleeName, projectId: $projectId}) // Find potential callee by name and project
            MERGE (caller)-[r:CALLS {line: $line}]->(callee) // Create relationship if nodes found
            RETURN id(r) as relId
        `, { ...call, projectId });
        // A more robust query would involve matching the callee based on resolved imports/scope.
    }

    console.log(`Finished populating graph elements for: ${filePath}`);
  });
}

// --- AST Traversal and Helper ---

export function traverseAst(ast: TSESTree.Node, visitor: Record<string, (node: any, parent?: any) => void>) {
  const walk = (node: TSESTree.Node | null | undefined, parent?: TSESTree.Node) => {
    if (!node) return;

    const nodeType = node.type;
    if (visitor[nodeType]) {
      visitor[nodeType](node, parent);
    }

    // Generic traversal (consider using estraverse for more robust traversal)
    for (const key in node) {
      if (key === 'parent') continue; // Avoid circular traversal
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const child = (node as any)[key];
        if (typeof child === 'object' && child !== null) {
          if (Array.isArray(child)) {
            child.forEach((item: TSESTree.Node) => walk(item, node));
          } else if (child.type) { // Check if it looks like an AST node
            walk(child, node);
          }
        }
      }
    }
  };

  walk(ast);
}

// Simple helper to find an ancestor node matching a condition
function findParentNode(startNode: TSESTree.Node, parent: TSESTree.Node | undefined, condition: (node: TSESTree.Node) => boolean): TSESTree.Node | null {
   let current: TSESTree.Node | undefined = parent;
   // Note: This requires parent pointers which our basic traverseAst doesn't add.
   // A more robust traversal library (like estraverse) or manually adding parent refs is needed.
   // This is a placeholder showing the *intent*.
   /*
   while (current) {
     if (condition(current)) {
       return current;
     }
     current = (current as any).parent; // Assumes parent pointer exists
   }
   */
   return null; // Placeholder
}


// --- AST-Grep Integration (Placeholder) ---

// Add AST-Grep execution logic here later
// import { exec } from 'child_process';
// import { promisify } from 'util';
// const execAsync = promisify(exec);

// export async function runAstGrep(pattern: string, path: string) {
//   try {
//     const command = `sg --pattern '${pattern}' ${path} --json`;
//     const { stdout, stderr } = await execAsync(command);
//     if (stderr) {
//       console.error('AST-Grep stderr:', stderr);
//     }
//     return JSON.parse(stdout);
//   } catch (error) {
//     console.error('Error running AST-Grep:', error);
//     throw new Error('AST-Grep execution failed');
//   }
// }

// --- Diff Calculation (Placeholder) ---
// Add Diff calculation logic here later
// import { diffChars } from 'diff';

// export function calculateDiff(oldCode: string, newCode: string) {
//   return diffChars(oldCode, newCode);
// } 