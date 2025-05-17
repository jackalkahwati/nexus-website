import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Nexus Core - Railway Deployment</h1>
      <p>Next.js app successfully deployed on Railway!</p>
    </div>
  );
} 