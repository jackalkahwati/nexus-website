export default function DeploymentCheckPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Deployment Check</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-8 py-6 rounded-lg shadow-md">
        <p className="text-2xl font-semibold mb-4">🚀 Deployment Successful!</p>
        <p className="mb-4">
          This page confirms that your Next.js application has been successfully deployed.
        </p>
        <p className="mb-6">
          Environment: <strong>{process.env.NODE_ENV}</strong><br />
          Server Time: <strong>{new Date().toLocaleString()}</strong>
        </p>
        <a 
          href="/dashboard" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
} 