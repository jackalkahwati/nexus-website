'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import GraphVisualizer from '@/components/refactor/GraphVisualizer';
import DiffView from '@/components/refactor/DiffView';
import SimpleDiffView from '@/components/refactor/SimpleDiffView';
import { useParams } from 'next/navigation';
import { ReactFlowProvider, NodeTypes, EdgeTypes } from 'reactflow';

interface FileDiff {
  fileName: string;
  oldCode: string;
  newCode: string;
}

export default function RefactorPage() {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [contextLoading, setContextLoading] = useState<boolean>(false);
  const [refactorContext, setRefactorContext] = useState<any>(null);
  const [contextError, setContextError] = useState<string | null>(null);
  
  // Refactoring state
  const [showRefactorPanel, setShowRefactorPanel] = useState<boolean>(false);
  const [refactoringInstructions, setRefactoringInstructions] = useState<string>('');
  const [isApplyingRefactoring, setIsApplyingRefactoring] = useState<boolean>(false);
  const [refactoringError, setRefactoringError] = useState<string | null>(null);
  const [diffData, setDiffData] = useState<FileDiff[]>([]);
  
  // Ref for instruction textarea
  const instructionsRef = useRef<HTMLTextAreaElement>(null);
  
  // Use memoized empty objects for node and edge types to avoid React Flow warnings
  const nodeTypes = useMemo<NodeTypes>(() => ({}), []);
  const edgeTypes = useMemo<EdgeTypes>(() => ({}), []);

  // Callback passed to GraphVisualizer
  const handleNodesSelected = useCallback((nodeIds: string[]) => {
    setSelectedNodeIds(nodeIds);
  }, []);

  // Function to fetch context for selected nodes
  const fetchContext = useCallback(async () => {
    if (!projectId || selectedNodeIds.length === 0) {
      alert('Please select one or more nodes in the graph first.');
      return false;
    }

    setContextLoading(true);
    setRefactorContext(null);
    setContextError(null);
    console.log(`Fetching context for project ${projectId} and nodes:`, selectedNodeIds);

    try {
      const response = await fetch('/api/refactor/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, selectedNodeIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const contextData = await response.json();
      console.log('Received context:', contextData);
      setRefactorContext(contextData);
      return true;
    } catch (error) {
      console.error("Failed to fetch context:", error);
      const message = error instanceof Error ? error.message : 'Unknown error fetching context';
      setContextError(message);
      return false;
    } finally {
      setContextLoading(false);
    }
  }, [projectId, selectedNodeIds]);

  // Show refactor panel after fetching context
  const fetchAndShowContext = useCallback(async () => {
    const success = await fetchContext();
    if (success) {
      setShowRefactorPanel(true);
      // Clear any previous results
      setDiffData([]);
      setRefactoringError(null);
      
      // Focus on the instructions textarea when panel opens
      setTimeout(() => {
        if (instructionsRef.current) {
          instructionsRef.current.focus();
        }
      }, 100);
    }
  }, [fetchContext]);
  
  // Apply refactoring function
  const handleApplyRefactoring = useCallback(async () => {
    if (!projectId || !refactorContext) {
      setRefactoringError('Missing context or project ID');
      return;
    }
    
    if (!refactoringInstructions.trim()) {
      setRefactoringError('Please provide refactoring instructions');
      return;
    }
    
    setIsApplyingRefactoring(true);
    setRefactoringError(null);
    
    try {
      const response = await fetch('/api/refactor/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          selectedNodeIds,
          instructions: refactoringInstructions,
          context: refactorContext
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Refactoring result:', result);
      
      // Set the diff data for the diff view
      setDiffData(result.diffs || []);
      
      // Close the refactoring panel to show results
      setShowRefactorPanel(false);
      
    } catch (error) {
      console.error("Failed to apply refactoring:", error);
      const message = error instanceof Error ? error.message : 'Unknown error applying refactoring';
      setRefactoringError(message);
    } finally {
      setIsApplyingRefactoring(false);
    }
  }, [projectId, refactorContext, refactoringInstructions, selectedNodeIds]);

  // Log the current state for debugging
  console.log("RefactorPage render state:", { 
    projectId, 
    selectedNodeIds: selectedNodeIds.length, 
    showRefactorPanel,
    hasRefactorContext: !!refactorContext,
    isLoading: contextLoading,
    hasError: !!contextError
  });

  return (
    <ReactFlowProvider>
      <div className="container mx-auto p-4 text-white min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Refactoring Project: {projectId || 'Loading...'}</h1>
        <div className="mb-2 p-2 bg-blue-700 text-white text-sm rounded">Debug: ProjectID = {projectId}, Selected Nodes: {selectedNodeIds.length}</div>

        {/* Conditionally render Graph or Refactor Panel */}
        {showRefactorPanel ? (
          <div className="p-6 border border-gray-300 rounded bg-white text-black shadow-lg max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Refactoring Options</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions:</label>
              <textarea
                ref={instructionsRef}
                rows={4}
                value={refactoringInstructions}
                onChange={(e) => setRefactoringInstructions(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., extract logging methods, rename getUser to findUserById, improve error handling..."
              />
              {refactoringError && (
                <p className="text-red-500 text-sm mt-1">{refactoringError}</p>
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">Context:</h3>
            <pre className="text-xs bg-gray-100 text-gray-800 p-3 rounded overflow-auto max-h-48 mb-4 border border-gray-200">
              {refactorContext ? JSON.stringify(refactorContext, null, 2) : 'Loading context...'}
            </pre>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRefactorPanel(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={isApplyingRefactoring}
              >
                Back to Graph
              </button>
              <button
                onClick={handleApplyRefactoring}
                disabled={isApplyingRefactoring || !refactoringInstructions.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isApplyingRefactoring ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </span>
                ) : 'Apply Refactoring'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Selection/Context Controls */}
            <div className="mb-4 p-4 border border-gray-700 rounded bg-gray-800 shadow w-full md:w-1/3">
              <h3 className="font-semibold mb-2">Controls</h3>
              <p className="text-sm text-gray-400 mb-2">
                Selected Nodes: {selectedNodeIds.length > 0 ? selectedNodeIds.join(', ') : 'None'}
              </p>
              <button
                onClick={fetchAndShowContext}
                disabled={selectedNodeIds.length === 0 || contextLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {contextLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Context...
                  </span>
                ) : 'Refactor Selection'}
              </button>
              {contextError && <p className="text-red-500 text-sm mt-2">Error: {contextError}</p>}
            </div>

            {/* Graph Area */}
            <h2 className="text-xl font-semibold mb-2">Code Structure Graph</h2>
            {projectId ? (
              <GraphVisualizer 
                projectId={projectId} 
                onNodesSelected={handleNodesSelected} 
              />
            ) : (
              <div className="p-4 border border-gray-700 rounded bg-gray-800 text-gray-300">
                Loading project graph or Project ID not found in URL...
              </div>
            )}
          </>
        )}

        {/* Diff View - Show only if there's data */}
        {diffData.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Refactoring Diff</h2>
            
            {/* Use ErrorBoundary or try-catch in real app */}
            {(() => {
              try {
                return <DiffView diffs={diffData} />;
              } catch (error) {
                console.error("Error rendering DiffView:", error);
                return <SimpleDiffView diffs={diffData} />;
              }
            })()}
            
            {/* Button to create new refactoring */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowRefactorPanel(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Another Refactoring
              </button>
            </div>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
} 