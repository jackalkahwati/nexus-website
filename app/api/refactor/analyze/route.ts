import { NextResponse } from 'next/server';
import { parseCode, populateGraphFromAst } from '@/lib/refactor/analysis'; // Assuming alias @ points to root
import { getSession, useLocalDatabase } from '@/lib/refactor/neo4j'; // Import Neo4j helper

// Use local database by default
useLocalDatabase(true);

interface AnalyzeRequestBody {
  filePath: string;
  codeContent: string;
  projectId: string; // To associate nodes with a project/analysis run
}

export async function POST(request: Request) {
  // TODO: Implement code analysis logic
  // 1. Receive code/repo path from request body
  // 2. Parse code using @typescript-eslint/typescript-estree
  // 3. Populate Neo4j graph
  console.log("Received analysis request");
  let session;
  try {
    const body: AnalyzeRequestBody = await request.json();
    const { filePath, codeContent, projectId } = body;

    if (!filePath || !codeContent || !projectId) {
      return NextResponse.json({ error: 'Missing required fields: filePath, codeContent, projectId' }, { status: 400 });
    }

    console.log(`Analyzing file: ${filePath} for project: ${projectId}`);

    // 1. Parse the code
    const ast = await parseCode(codeContent, filePath);
    
    try {
      // 2. Get Neo4j session
      session = getSession();

      // 3. Populate graph (initial implementation)
      await populateGraphFromAst(session, ast, filePath, projectId);

      console.log(`Successfully analyzed and populated graph for: ${filePath}`);

      // Calculate and return some basic stats about the code
      const nodeCount = countNodes(ast);
      
      return NextResponse.json({ 
        message: `Analysis complete for ${filePath}`,
        stats: {
          fileName: filePath,
          nodeCount,
          projectId
        }
      });
    } catch (neo4jError) {
      console.error("Neo4j error:", neo4jError);
      // If Neo4j connection fails, still return success with stats but note the storage failure
      const nodeCount = countNodes(ast);
      
      return NextResponse.json({ 
        message: `Analysis complete but Neo4j storage failed for ${filePath}`,
        stats: {
          fileName: filePath,
          nodeCount,
          projectId,
          neo4jStorageFailed: true
        }
      });
    }
  } catch (error) {
    console.error("Analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to analyze: ${errorMessage}` }, { status: 500 });
  } finally {
    // Ensure Neo4j session is closed
    if (session) {
      try {
        await session.close();
        console.log("Neo4j session closed.");
      } catch (closeError) {
        console.error("Error closing Neo4j session:", closeError);
      }
    }
  }
}

// Helper to count AST nodes for basic stats
function countNodes(ast: any): number {
  let count = 0;
  
  function traverse(node: any) {
    if (!node || typeof node !== 'object') return;
    count++;
    
    // Process children if they exist
    if (Array.isArray(node.body)) {
      node.body.forEach(traverse);
    }
    
    // Handle other common node structures
    if (node.expression) traverse(node.expression);
    if (node.declarations) node.declarations.forEach(traverse);
    if (node.params) node.params.forEach(traverse);
    if (node.arguments) node.arguments.forEach(traverse);
    if (node.properties) node.properties.forEach(traverse);
    if (node.elements) node.elements.forEach(traverse);
    if (node.block) traverse(node.block);
    if (node.consequent) traverse(node.consequent);
    if (node.alternate) traverse(node.alternate);
  }
  
  traverse(ast);
  return count;
} 