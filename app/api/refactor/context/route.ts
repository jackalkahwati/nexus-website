import { NextResponse } from 'next/server';
import { getSession } from '@/lib/refactor/neo4j';
import neo4j from 'neo4j-driver';

interface ContextRequestBody {
  projectId: string;
  selectedNodeIds: string[]; // Neo4j internal IDs as strings
}

export async function POST(request: Request) {
  console.log("Received context request");
  let session = null;
  try {
    const body: ContextRequestBody = await request.json();
    const { projectId, selectedNodeIds } = body;

    if (!projectId || !selectedNodeIds || selectedNodeIds.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: projectId, selectedNodeIds' }, { status: 400 });
    }

    // Allow mock mode to bypass Neo4j
    if (request.headers.get('x-use-mock') === 'true') {
      return getMockContext(selectedNodeIds);
    }
    
    try {
      // Convert string IDs back to numbers for Neo4j internal ID matching
      const targetNodeIds = selectedNodeIds.map(id => neo4j.int(id));

      console.log(`Fetching context for project ${projectId}, nodes:`, selectedNodeIds);

      session = getSession();

      // Cypher Query for Context Gathering
      const result = await session.run(
        `MATCH (n)
         WHERE id(n) IN $targetNodeIds // Start with selected nodes
         // Get direct neighbors (change depth with *1..N)
         OPTIONAL MATCH (n)-[r]-(neighbor {projectId: $projectId})
         // Also include relationships between the selected nodes/neighbors
         WITH collect(n) + collect(neighbor) as nodeset, collect(r) as relset
         UNWIND nodeset as node // Unwind nodes to get distinct nodes
         WITH collect(distinct node) as allNodes, relset
         // Now get relationships only between the nodes in our context set
         OPTIONAL MATCH (src)-[rel]->(tgt)
         WHERE id(src) IN [n IN allNodes | id(n)] AND id(tgt) IN [n IN allNodes | id(n)]
         RETURN collect(distinct src {id: id(src), labels: labels(src), properties: properties(src)}) as nodes,
                collect(distinct rel {id: id(rel), type: type(rel), start: id(startNode(rel)), end: id(endNode(rel)), properties: properties(rel)}) as edges
        `,
        { targetNodeIds, projectId }
      );

      if (result.records.length === 0) {
        return NextResponse.json({ nodes: [], edges: [] }); // Return empty context if nothing found
      }

      const record = result.records[0];
      const context = {
        nodes: record.get('nodes').map((node: any) => ({ ...node, id: node.id.toString() })), // Ensure IDs are strings for JSON
        edges: record.get('edges').map((edge: any) => ({
          ...edge,
          id: edge.id.toString(),
          start: edge.start.toString(),
          end: edge.end.toString(),
        }))
      };

      console.log(`Returning context with ${context.nodes.length} nodes and ${context.edges.length} edges.`);
      return NextResponse.json(context);
    } catch (neo4jError) {
      console.error("Neo4j error:", neo4jError);
      // Fall back to mock if Neo4j fails
      return getMockContext(selectedNodeIds);
    }

  } catch (error) {
    console.error("Context fetch error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // If there's an error with Neo4j, fall back to mock data
    console.log("Falling back to mock context data due to Neo4j error");
    return getMockContext(["1"]); // Just use a default ID for mock data
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Neo4j session closed for context fetch.");
      } catch (closeError) {
        console.error("Error closing Neo4j session:", closeError);
      }
    }
  }
}

function getMockContext(selectedNodeIds: string[]) {
  console.log(`Returning mock context data for nodes:`, selectedNodeIds);
  
  // Return sample context data for testing
  const sampleContext = {
    nodes: [
      {
        id: selectedNodeIds[0] || "1",
        labels: ["Function"],
        properties: {
          name: "getUsers",
          path: "/src/controllers/user.controller.ts",
          type: "Function",
          startLine: 5,
          endLine: 15,
          params: "req, res",
          projectId: "test-project"
        }
      },
      {
        id: "related-node-1",
        labels: ["Function"],
        properties: {
          name: "findAllUsers",
          path: "/src/services/user.service.ts",
          type: "Function",
          startLine: 10,
          endLine: 20,
          params: "",
          projectId: "test-project"
        }
      },
      {
        id: "related-node-2",
        labels: ["Class"],
        properties: {
          name: "UserRepository",
          path: "/src/repositories/user.repository.ts",
          type: "Class",
          startLine: 5,
          endLine: 50,
          projectId: "test-project"
        }
      }
    ],
    edges: [
      {
        id: "edge-1",
        type: "CALLS",
        start: selectedNodeIds[0] || "1",
        end: "related-node-1",
        properties: {
          line: 8
        }
      },
      {
        id: "edge-2",
        type: "USES",
        start: "related-node-1",
        end: "related-node-2",
        properties: {
          line: 12
        }
      }
    ],
    source: "mock"
  };
  
  return NextResponse.json(sampleContext);
}