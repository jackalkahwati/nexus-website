'use client';

import React, { useState, useEffect } from 'react';

interface Neo4jStatus {
  connected: boolean;
  uri?: string;
  user?: string;
  error?: string;
  details?: Record<string, any>;
}

export default function RefactorAdmin() {
  const [status, setStatus] = useState<Neo4jStatus>({ connected: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState('initial-analysis');
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [useMockMode, setUseMockMode] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const mockParam = useMockMode ? '&mock=true' : '';
      const res = await fetch(`/api/refactor/init?projectId=${projectId}${mockParam}`);
      const data = await res.json();
      
      if (res.ok) {
        setStatus({
          connected: data.status === 'success',
          details: data.details
        });
      } else {
        setError(data.message || 'Failed to connect to Neo4j');
        setStatus({ connected: false, error: data.message });
      }
    } catch (error) {
      console.error('Error checking Neo4j connection:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setStatus({ connected: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const seedData = async () => {
    setLoading(true);
    setSeedStatus(null);
    try {
      const mockParam = useMockMode ? '&mock=true' : '';
      const res = await fetch(`/api/refactor/init?projectId=${projectId}&seed=true${mockParam}`);
      const data = await res.json();
      
      if (res.ok) {
        if (useMockMode) {
          setSeedStatus(`Mock mode: No actual data seeded, but you can use mock data for project: ${projectId}`);
        } else {
          setSeedStatus(`Successfully seeded demo data for project: ${projectId}`);
        }
      } else {
        setSeedStatus(`Error: ${data.message || 'Failed to seed demo data'}`);
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
      setSeedStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Neo4j Refactoring Admin</h1>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Connection Status</h2>
        
        {loading ? (
          <div className="flex items-center space-x-2 text-blue-400">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Checking connection...</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-3">
              <div className={`w-4 h-4 rounded-full mr-2 ${status.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-lg font-medium">
                {status.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {status.details && (
              <div className="bg-gray-900 p-4 rounded mb-4 text-sm">
                <pre className="whitespace-pre-wrap">{JSON.stringify(status.details, null, 2)}</pre>
              </div>
            )}
            
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded mb-4">
                {error}
              </div>
            )}
          </div>
        )}
        
        <button 
          onClick={checkConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          Refresh Connection Status
        </button>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Seed Demo Data</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project ID
          </label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter project ID"
          />
        </div>
        
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useMockMode}
              onChange={(e) => setUseMockMode(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm text-gray-300">Use Mock Mode (bypass Neo4j)</span>
          </label>
          {useMockMode && (
            <p className="text-xs text-yellow-400 mt-1 ml-6">
              Mock mode will use sample data instead of connecting to Neo4j.
              Use this if you don't have a Neo4j server configured.
            </p>
          )}
        </div>
        
        {seedStatus && (
          <div className={`p-3 rounded mb-4 ${seedStatus.startsWith('Error') ? 'bg-red-900/30 text-red-300 border border-red-700' : 'bg-green-900/30 text-green-300 border border-green-700'}`}>
            {seedStatus}
          </div>
        )}
        
        <button 
          onClick={seedData}
          disabled={loading || !projectId.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : useMockMode ? 'Initialize Mock Data' : 'Seed Demo Data'}
        </button>
      </div>
      
      <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Usage Instructions</h2>
        
        <ol className="list-decimal pl-6 space-y-2">
          <li>Check the connection status to ensure Neo4j is properly configured</li>
          <li>Seed demo data for a project ID (e.g., "initial-analysis")</li>
          <li>Visit the <a href="/refactor/initial-analysis" className="text-blue-400 hover:underline">refactoring page</a> with the same project ID</li>
          <li>The graph will load data from Neo4j if connected, or fall back to mock data</li>
        </ol>
        
        <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 text-yellow-300 rounded">
          <strong>Note:</strong> If Neo4j connection fails, the system will automatically fall back to mock data so the interface remains functional.
        </div>
      </div>
    </div>
  );
}