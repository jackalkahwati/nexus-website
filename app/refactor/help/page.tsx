'use client';

import React from 'react';
import Link from 'next/link';

export default function RefactorHelp() {
  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Refactoring System Developer Guide</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="mb-4">
              The refactoring system allows you to visualize code structure as a graph, select components for refactoring,
              and apply automated refactorings with a diff view to review changes.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Interactive code structure graph visualization</li>
              <li>Context-aware node selection</li>
              <li>Automated refactoring suggestions</li>
              <li>Side-by-side diff view for code changes</li>
              <li>Neo4j database integration for robust code analysis</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">Architecture</h3>
            <p className="mb-2">The system consists of several components:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Graph Visualization</strong> - Using ReactFlow for interactive node-based visualization</li>
              <li><strong>Neo4j Database</strong> - Storing code structure as a graph with relationships</li>
              <li><strong>Refactoring Engine</strong> - Processing refactoring instructions and generating diffs</li>
              <li><strong>Diff View</strong> - Displaying code changes with syntax highlighting</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">GET /api/refactor/graph</h3>
              <p className="mb-2">Retrieves the code structure graph for a project.</p>
              <div className="bg-gray-900 p-3 rounded text-sm mb-2">
                <code>GET /api/refactor/graph?projectId=initial-analysis</code>
              </div>
              <p className="text-sm text-gray-400">Returns nodes and edges representing code structure.</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">POST /api/refactor/context</h3>
              <p className="mb-2">Gets detailed context for selected nodes.</p>
              <div className="bg-gray-900 p-3 rounded text-sm mb-2">
                <code>POST /api/refactor/context<br/>
                Content-Type: application/json<br/><br/>
                {`{
  "projectId": "initial-analysis",
  "selectedNodeIds": ["1", "2"]
}`}</code>
              </div>
              <p className="text-sm text-gray-400">Returns detailed information for selected nodes and their relationships.</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">POST /api/refactor/apply</h3>
              <p className="mb-2">Applies refactoring instructions and returns diffs.</p>
              <div className="bg-gray-900 p-3 rounded text-sm mb-2">
                <code>POST /api/refactor/apply<br/>
                Content-Type: application/json<br/><br/>
                {`{
  "projectId": "initial-analysis",
  "selectedNodeIds": ["1", "2"],
  "instructions": "Extract logging methods",
  "context": { ... }
}`}</code>
              </div>
              <p className="text-sm text-gray-400">Returns diffs showing the code changes.</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">GET /api/refactor/init</h3>
              <p className="mb-2">Initializes and tests Neo4j connection, optionally seeds demo data.</p>
              <div className="bg-gray-900 p-3 rounded text-sm mb-2">
                <code>GET /api/refactor/init?projectId=initial-analysis&seed=true</code>
              </div>
              <p className="text-sm text-gray-400">Useful for admin purposes and testing Neo4j connectivity.</p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/refactor/initial-analysis" className="text-blue-400 hover:underline">
                  → Refactoring Interface
                </Link>
              </li>
              <li>
                <Link href="/refactor/admin" className="text-blue-400 hover:underline">
                  → Admin Panel
                </Link>
              </li>
              <li>
                <a href="https://neo4j.com/docs/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  → Neo4j Documentation
                </a>
              </li>
              <li>
                <a href="https://reactflow.dev/docs/guides/refactoring/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  → ReactFlow Documentation
                </a>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-900/40 border border-blue-700 rounded">
              <h3 className="font-medium mb-2">Try Example Refactorings</h3>
              <ul className="text-sm space-y-1">
                <li>• "Extract logging methods"</li>
                <li>• "Rename getUser to findUserById"</li>
                <li>• "Improve error handling"</li>
                <li>• "Add input validation"</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Neo4j Setup</h2>
            <p className="mb-4">We're using Neo4j for graph storage. The connection can be configured in the `.env.local` file:</p>
            
            <div className="bg-gray-900 p-3 rounded text-sm mb-4">
              <code>
                NEO4J_URI=neo4j+s://demo.neo4jlabs.com:7687<br/>
                NEO4J_USER=demo<br/>
                NEO4J_PASSWORD=demo
              </code>
            </div>
            
            <p className="text-sm text-gray-400 mb-4">
              For production use, set up a dedicated Neo4j instance and update these credentials.
            </p>
            
            <a href="/refactor/admin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block">
              Configure Neo4j
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}