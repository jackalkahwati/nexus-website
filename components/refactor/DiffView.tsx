'use client';

import React from 'react';

interface FileDiff {
  fileName: string;
  oldCode: string;
  newCode: string;
}

interface DiffViewProps {
  diffs: FileDiff[];
  isLoading?: boolean;
}

const DiffView: React.FC<DiffViewProps> = ({ diffs, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 text-gray-400 flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mr-3"></div>
        <span>Generating diff...</span>
      </div>
    );
  }

  if (!diffs || diffs.length === 0) {
    return (
      <div className="p-6 text-gray-500 flex flex-col items-center justify-center h-48">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No changes to display. Apply a refactoring to see the diff.</p>
      </div>
    );
  }

  // Renderers for different line types
  const renderLine = (line: string, type: 'normal' | 'addition' | 'deletion', lineNumber: number) => {
    let bgClass = '';
    let textClass = '';
    let prefixChar = ' ';

    switch (type) {
      case 'addition':
        bgClass = 'bg-green-100 dark:bg-green-900/20';
        textClass = 'text-green-800 dark:text-green-300';
        prefixChar = '+';
        break;
      case 'deletion':
        bgClass = 'bg-red-100 dark:bg-red-900/20';
        textClass = 'text-red-800 dark:text-red-300';
        prefixChar = '-';
        break;
      case 'normal':
      default:
        bgClass = 'bg-transparent';
        textClass = 'text-gray-700 dark:text-gray-300';
    }

    return (
      <div key={`${type}-${lineNumber}`} className={`flex ${bgClass} hover:bg-gray-100 dark:hover:bg-gray-800/50 font-mono text-sm`}>
        <div className="w-10 p-1 text-right text-gray-500 select-none border-r border-gray-300 dark:border-gray-600 mr-2">
          {lineNumber}
        </div>
        <div className={`p-1 flex-1 whitespace-pre ${textClass}`}>
          <span className="mr-2 select-none">{prefixChar}</span>
          {line}
        </div>
      </div>
    );
  };

  // Function to create a diff view from original and modified code
  const createSimpleDiff = (oldCode: string, newCode: string) => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    
    // Using a simple but more accurate line-by-line diff algorithm
    const diffElements = [];
    
    // Calculate line-by-line diff using longest common subsequence (LCS) algorithm
    const lcs = findLongestCommonSubsequence(oldLines, newLines);
    const diff = buildDiff(oldLines, newLines, lcs);
    
    // Render the diff elements
    let lineNumberOld = 1;
    let lineNumberNew = 1;
    
    for (const item of diff) {
      if (item.type === 'same') {
        diffElements.push(renderLine(item.value, 'normal', lineNumberNew));
        lineNumberOld++;
        lineNumberNew++;
      } else if (item.type === 'removed') {
        diffElements.push(renderLine(item.value, 'deletion', lineNumberOld));
        lineNumberOld++;
      } else if (item.type === 'added') {
        diffElements.push(renderLine(item.value, 'addition', lineNumberNew));
        lineNumberNew++;
      }
    }
    
    return diffElements;
  };
  
  // LCS algorithm for finding the longest common subsequence
  const findLongestCommonSubsequence = (a: string[], b: string[]): number[][] => {
    const matrix: number[][] = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));
    
    // Fill the matrix
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }
    
    return matrix;
  };
  
  // Build diff from LCS result
  type DiffItem = { type: 'same' | 'added' | 'removed', value: string };
  
  const buildDiff = (a: string[], b: string[], lcs: number[][]): DiffItem[] => {
    const diff: DiffItem[] = [];
    let i = a.length;
    let j = b.length;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        // Lines are the same
        diff.unshift({ type: 'same', value: a[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        // Line was added
        diff.unshift({ type: 'added', value: b[j - 1] });
        j--;
      } else if (i > 0) {
        // Line was removed
        diff.unshift({ type: 'removed', value: a[i - 1] });
        i--;
      }
    }
    
    return diff;
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {diffs.map((diff, index) => (
        <div key={`${diff.fileName}-${index}`} className="mb-6">
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-medium">
            {diff.fileName}
          </div>
          <div className="overflow-auto max-h-96">
            {createSimpleDiff(diff.oldCode, diff.newCode)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiffView;