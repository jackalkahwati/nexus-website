'use client';

import React from 'react';

// Simple fallback diff view component in case there are issues with the main one
interface FileDiff {
  fileName: string;
  oldCode: string;
  newCode: string;
}

interface SimpleDiffViewProps {
  diffs: FileDiff[];
  isLoading?: boolean;
}

const SimpleDiffView: React.FC<SimpleDiffViewProps> = ({ diffs, isLoading = false }) => {
  if (isLoading) {
    return <div className="p-4 bg-gray-800 text-white">Loading diffs...</div>;
  }

  if (!diffs || diffs.length === 0) {
    return <div className="p-4 bg-gray-800 text-white">No diffs available.</div>;
  }

  return (
    <div className="bg-white text-black p-4 rounded border border-gray-300">
      {diffs.map((diff, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-bold mb-2">{diff.fileName}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-1">Original Code:</h4>
              <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 text-xs">{diff.oldCode}</pre>
            </div>
            <div>
              <h4 className="font-bold mb-1">Modified Code:</h4>
              <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 text-xs">{diff.newCode}</pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimpleDiffView;