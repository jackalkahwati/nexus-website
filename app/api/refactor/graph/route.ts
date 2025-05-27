import { NextResponse } from 'next/server';
import { getSession, useLocalDatabase } from '@/lib/refactor/neo4j';
import neo4j, { Session } from 'neo4j-driver';

// Use local database by default - only need to call this once
// This ensures we're not repeatedly trying to connect to Neo4j
const USE_LOCAL_DB = true;
useLocalDatabase(USE_LOCAL_DB);

// Set this flag to ensure we always use our local graph data instead of mock data
const ALWAYS_USE_LOCAL_DATA = true;

interface GraphNode {
  id: string; 
  type: string; 
  data: Record<string, any>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  data?: Record<string, any>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const forceMock = searchParams.get('mock') === 'true';
  const timestampParam = searchParams.get('_t');
  
  console.log(`[API] Graph request for projectId: ${projectId}, forceMock: ${forceMock}`);
  
  // For debugging, uncomment this to force real data (local DB)
  // const USE_DEBUG_MODE = true;

  if (!projectId) {
    return NextResponse.json({ error: 'Missing required query parameter: projectId' }, { status: 400 });
  }

  // Add cache control headers to prevent stale data and browser caching issues
  const headers = {
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
    'Content-Type': 'application/json',
  };
  
  if (forceMock) {
    return NextResponse.json(
      getGraphMockData(projectId, timestampParam || undefined), 
      { headers }
    );
  }
  
  let session = null;
  try {
    // TEMPORARY SOLUTION: Fetch from test API server instead of using Neo4j
    try {
      console.log("Using test API server instead of Neo4j");
      const testApiUrl = `http://localhost:3005/api/graph?projectId=${encodeURIComponent(projectId)}`;
      const response = await fetch(testApiUrl, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error(`Test API server returned ${response.status}`);
      }
      
      const testApiData = await response.json();
      console.log(`Test API returned ${testApiData.nodes?.length || 0} nodes and ${testApiData.edges?.length || 0} edges`);
      
      if (testApiData.nodes?.length > 0) {
        return NextResponse.json(testApiData, { headers });
      }
      
      // Fall through to Neo4j if test API returns no data
      console.log("Test API returned no data, falling back to Neo4j");
      session = getSession({ 
        database: 'neo4j',
        fetchSize: 1000
      });
    } catch (sessionError) {
      console.error("Failed to connect to test API or create database session:", sessionError);
      return NextResponse.json(
        getGraphMockData(projectId, timestampParam || undefined),
        { headers }
      );
    }
    
    // Query to get all nodes and relationships for the given projectId
    const result = await session.run(
      `MATCH (n {projectId: $projectId})
       WITH n LIMIT 200
       OPTIONAL MATCH (n)-[r]->(m {projectId: $projectId})
       RETURN n, r, m`,
      { projectId }
    );

    // Process the result
    const nodes = new Map<string, GraphNode>();
    const edges = new Map<string, GraphEdge>();

    result.records.forEach(record => {
      const nodeN = record.get('n');
      const relationshipR = record.get('r');
      const nodeM = record.get('m');

      // Process node N if it exists and hasn't been added yet
      if (nodeN) {
          const nodeIdN = nodeN.identity.toString();
          if (!nodes.has(nodeIdN)) {
              nodes.set(nodeIdN, {
                  id: nodeIdN,
                  type: nodeN.labels[0] || 'Unknown',
                  data: nodeN.properties
              });
          }
      }

      // Process node M if it exists and hasn't been added yet
      if (nodeM) {
          const nodeIdM = nodeM.identity.toString();
          if (!nodes.has(nodeIdM)) {
              nodes.set(nodeIdM, {
                  id: nodeIdM,
                  type: nodeM.labels[0] || 'Unknown',
                  data: nodeM.properties
              });
          }
      }

      // Process relationship R if it exists and hasn't been added yet
      if (relationshipR) {
          const edgeId = relationshipR.identity.toString();
          if (!edges.has(edgeId)) {
              edges.set(edgeId, {
                  id: edgeId,
                  source: relationshipR.start.toString(),
                  target: relationshipR.end.toString(),
                  label: relationshipR.type,
                  data: relationshipR.properties
              });
          }
      }
    });

    const nodeArray = Array.from(nodes.values());
    const edgeArray = Array.from(edges.values());
    
    console.log(`[API] Local DB returned ${nodeArray.length} nodes and ${edgeArray.length} edges`);
    
    if (nodeArray.length > 0) {
      console.log(`[API] Sample node:`, nodeArray[0]);
    }
    
    const graphData = {
      nodes: nodeArray,
      edges: edgeArray,
      source: 'local-db',
      timestamp: Date.now(),
      debug: {
        nodeCount: nodeArray.length,
        edgeCount: edgeArray.length
      }
    };

    // Check if we actually got data - if not, fall back to mock
    // Skip this check if we're always using local data
    if (!ALWAYS_USE_LOCAL_DATA && graphData.nodes.length === 0) {
      return NextResponse.json(
        getGraphMockData(projectId, timestampParam || undefined),
        { headers }
      );
    }

    return NextResponse.json(graphData, { headers });

  } catch (error) {
    console.error("Graph fetch error:", error);
    
    // If there's an error, fall back to mock data only if we're not always using local data
    if (!ALWAYS_USE_LOCAL_DATA) {
      return NextResponse.json(
        getGraphMockData(projectId, timestampParam || undefined),
        { headers }
      );
    } else {
      // If we're always using local data, return an error response instead
      return NextResponse.json(
        { error: "Failed to retrieve graph data", message: (error as Error)?.message },
        { status: 500, headers }
      );
    }
  } finally {
    if (session) {
      try {
        await session.close();
      } catch (closeError) {
        console.error("Error closing database session:", closeError);
      }
    }
  }
}

// Mock data generator function for fallback
function getGraphMockData(projectId: string, timestamp?: string) {
  // Create sample nodes with different types
  const sampleNodes: GraphNode[] = [
    { 
      id: '1', 
      type: 'File', 
      data: { 
        name: 'index.ts', 
        path: '/src/index.ts',
        projectId 
      } 
    },
    { 
      id: '2', 
      type: 'Class', 
      data: { 
        name: 'UserService', 
        path: '/src/services/user.service.ts',
        projectId 
      } 
    },
    { 
      id: '3', 
      type: 'Function', 
      data: { 
        name: 'getUsers', 
        path: '/src/controllers/user.controller.ts',
        projectId 
      } 
    },
    { 
      id: '4', 
      type: 'Method', 
      data: { 
        name: 'findById', 
        path: '/src/repositories/user.repository.ts',
        projectId 
      } 
    },
    { 
      id: '5', 
      type: 'Function', 
      data: { 
        name: 'validateUser', 
        path: '/src/utils/validation.ts',
        projectId 
      } 
    },
    { 
      id: '6', 
      type: 'Class', 
      data: { 
        name: 'AuthService', 
        path: '/src/services/auth.service.ts',
        projectId 
      } 
    },
    { 
      id: '7', 
      type: 'Method', 
      data: { 
        name: 'authenticate', 
        path: '/src/services/auth.service.ts',
        projectId 
      } 
    },
  ];

  // Create sample edges between nodes
  const sampleEdges: GraphEdge[] = [
    { id: 'e1-2', source: '1', target: '2', label: 'IMPORTS' },
    { id: 'e1-3', source: '1', target: '3', label: 'IMPORTS' },
    { id: 'e2-4', source: '2', target: '4', label: 'CONTAINS' },
    { id: 'e3-5', source: '3', target: '5', label: 'CALLS' },
    { id: 'e3-4', source: '3', target: '4', label: 'CALLS' },
    { id: 'e1-6', source: '1', target: '6', label: 'IMPORTS' },
    { id: 'e6-7', source: '6', target: '7', label: 'CONTAINS' },
    { id: 'e3-7', source: '3', target: '7', label: 'CALLS' },
    { id: 'e5-7', source: '5', target: '7', label: 'CALLS' },
  ];

  // Return the graph data with timestamp to ensure uniqueness
  return {
    nodes: sampleNodes,
    edges: sampleEdges,
    source: 'mock',
    timestamp: timestamp || Date.now(),
    projectId
  };
}