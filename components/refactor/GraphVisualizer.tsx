'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  EdgeChange,
  NodeChange,
  NodeTypes,
  DefaultEdgeOptions,
  FitViewOptions,
  SelectionMode,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Interface matching the API response structure
interface ApiNode {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface ApiEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  data?: Record<string, any>;
}

interface GraphData {
  nodes: ApiNode[];
  edges: ApiEdge[];
}

interface GraphVisualizerProps {
  projectId: string;
  onNodesSelected: (selectedNodeIds: string[]) => void;
}

// --- Styling & Types (Defined outside component) --- >
const NODE_SIZE = 30;
const nodeColor = (nodeType: string | undefined): string => {
  switch (nodeType) {
    case 'API': return '#e74c3c'; // Red
    case 'Service': return '#3498db'; // Blue
    case 'Component': return '#2ecc71'; // Green
    case 'Hook': return '#9b59b6'; // Purple
    case 'Type': return '#f39c12'; // Orange
    case 'Model': return '#1abc9c'; // Teal
    case 'Page': return '#e67e22'; // Dark Orange
    case 'Util': return '#34495e'; // Dark Navy
    case 'Context': return '#16a085'; // Green-Blue
    case 'Route': return '#d35400'; // Burnt Orange
    case 'Module': return '#4682B4'; // Steel Blue
    case 'Config': return '#7f8c8d'; // Gray
    default: return '#95a5a6'; // Light gray
  }
};

const fitViewOptions: FitViewOptions = {
  padding: 0.3,
};

const baseDefaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  style: { stroke: '#ccc', strokeWidth: 1 },
};

// < --- End Styling & Types ---

export default function GraphVisualizer({
  projectId,
  onNodesSelected
}: GraphVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();

  // Memoize values to prevent recreating objects on each render
  const defaultEdgeOptions = useMemo(() => baseDefaultEdgeOptions, []);
  const nodeTypes = useMemo<NodeTypes>(() => ({}), []);
  const edgeTypes = useMemo(() => ({}), []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const handleSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[], edges: Edge[] }) => {
      const selectedIds = selectedNodes.map(node => node.id);
      console.log('Selected node IDs:', selectedIds);
      onNodesSelected(selectedIds);
  }, [onNodesSelected]);

  // Load graph data with retry logic for better stability
  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const loadGraphData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Add cache-busting parameter to avoid stale data
        const response = await fetch(
          `/api/refactor/graph?projectId=${encodeURIComponent(projectId)}&_t=${Date.now()}`, 
          { cache: 'no-store' }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GraphData = await response.json();
        
        if (!data || !data.nodes || !data.edges) {
          throw new Error("Invalid data structure received from API");
        }

        if (!isMounted) return;

        // Create flow nodes with stable positions based on node IDs
        // Improved layout for larger graphs
        const flowNodes: Node[] = data.nodes.map((node, index) => {
          // Use node.id as seed for deterministic but distributed positions
          const seed = parseInt(node.id.replace(/\D/g, '') || index.toString());
          
          // Use domain as a factor for grouping nodes
          const domain = node.data.domain || 'Unknown';
          const domainHash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          
          // Distribute nodes in a more spaced layout with domain clustering
          const radius = 300 + (domainHash % 300);
          const angle = (seed % 360) * (Math.PI / 180);
          const posX = Math.cos(angle) * radius + 800;
          const posY = Math.sin(angle) * radius + 500;
          
          // Size nodes based on type
          const nodeSize = 
            node.type === 'Service' ? NODE_SIZE * 1.5 : 
            node.type === 'Component' ? NODE_SIZE * 1.2 : 
            node.type === 'API' ? NODE_SIZE * 1.3 : 
            NODE_SIZE;
          
          return {
            id: node.id,
            position: { x: posX, y: posY },
            style: {
              background: nodeColor(node.type),
              width: nodeSize,
              height: nodeSize,
              borderRadius: '50%', 
              border: '1px solid #555',
              // Add label inside node for important types
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10px',
              color: '#fff',
              fontWeight: 'bold',
              textShadow: '0px 0px 2px #000',
            },
            data: { 
              label: node.data.name || node.data.path || 'Unnamed', 
              ...node.data,
              nodeType: node.type,
              domain: node.data.domain,
            },
          };
        });

        const flowEdges: Edge[] = data.edges.map(edge => {
          // Set edge style based on relationship type
          const getEdgeStyle = (label: string) => {
            switch (label) {
              case 'IMPORTS':
                return { stroke: '#3498db', strokeWidth: 1, strokeDasharray: '5,5' }; // Blue dashed
              case 'CALLS':
                return { stroke: '#e74c3c', strokeWidth: 1.5 }; // Red solid
              case 'USES':
                return { stroke: '#2ecc71', strokeWidth: 1 }; // Green solid
              case 'RENDERS':
                return { stroke: '#9b59b6', strokeWidth: 2 }; // Purple solid
              case 'DEFINES':
                return { stroke: '#f39c12', strokeWidth: 1, strokeDasharray: '3,3' }; // Orange dashed
              case 'IMPLEMENTS':
                return { stroke: '#1abc9c', strokeWidth: 1 }; // Teal solid
              case 'EXTENDS':
                return { stroke: '#e67e22', strokeWidth: 1.5 }; // Dark Orange solid
              case 'CONTAINS':
                return { stroke: '#34495e', strokeWidth: 1 }; // Dark Navy solid
              default:
                return { stroke: '#95a5a6', strokeWidth: 0.5 }; // Light gray thin
            }
          };
          
          return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.label === 'IMPORTS' || edge.label === 'DEFINES' ? 'step' : 'straight',
            animated: edge.label === 'CALLS',
            style: getEdgeStyle(edge.label),
            data: { relationshipType: edge.label }
          };
        });

        setNodes(flowNodes);
        setEdges(flowEdges);
        console.log(`Graph data loaded: ${flowNodes.length} nodes, ${flowEdges.length} edges`);
        
        // Add more debugging to see what's happening
        console.log('Graph data structure:', JSON.stringify({
          nodeCount: flowNodes.length,
          edgeCount: flowEdges.length,
          sampleNode: flowNodes.length > 0 ? flowNodes[0] : null,
          sampleEdge: flowEdges.length > 0 ? flowEdges[0] : null
        }, null, 2));
        
        // Use a longer delay to ensure ReactFlow is mounted before fitting view
        setTimeout(() => {
          console.log('Fitting view now...');
          reactFlowInstance?.fitView();
          console.log('View fitted');
        }, 1000);
        
      } catch (err) {
        console.error("Failed to fetch or layout graph data:", err);
        
        if (isMounted) {
          setError((err as Error)?.message || 'Failed to load or layout graph data.');
          
          // Try again with exponential backoff
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retry ${retryCount}/${maxRetries} in ${Math.pow(2, retryCount) * 500}ms`);
            setTimeout(loadGraphData, Math.pow(2, retryCount) * 500);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGraphData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (loading) return <div className="p-4 text-white text-lg">Loading graph visualization...</div>;
  if (error) return <div className="p-4 bg-red-800 text-white rounded-md my-2 p-4 text-lg">Error loading graph: {error}</div>;
  
  if (nodes.length === 0) {
    return (
      <div className="p-4 bg-yellow-800 text-white rounded-md my-2 p-4">
        <h3 className="text-lg font-bold mb-2">No graph data loaded</h3>
        <p>No nodes were returned from the API. This might happen if:</p>
        <ul className="list-disc ml-5 mt-2">
          <li>The database is empty</li>
          <li>The project ID doesn't match any nodes</li>
          <li>The API server isn't returning the correct data</li>
        </ul>
        <p className="mt-2">Project ID: {projectId}</p>
        <p className="mt-2">Try checking the browser console for more detailed errors.</p>
      </div>
    );
  }

  console.log('About to render ReactFlow with:', { nodesCount: nodes.length, edgesCount: edges.length });

  return (
    <div className="flex flex-col">
      <div className="mb-3 p-2 bg-gray-800 text-white rounded">
        Displaying {nodes.length} nodes and {edges.length} edges
      </div>
      <div style={{ 
        height: '70vh', 
        width: '100%', 
        background: '#f0f0f0', 
        border: '2px solid #333', 
        borderRadius: '4px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={handleSelectionChange}
          selectionMode={SelectionMode.Partial} 
          multiSelectionKeyCode={['Meta', 'Shift']}
          fitView={true}
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          nodesDraggable={true}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
          zoomOnScroll={true}
          panOnScroll={false}
          panOnDrag={true}
          minZoom={0.1}
          maxZoom={2}
          onInit={(instance) => {
            console.log('ReactFlow initialized');
            setTimeout(() => instance.fitView(), 500);
          }}
          style={{ background: '#f0f0f0' }}
        />
      </div>
    </div>
  );
} 