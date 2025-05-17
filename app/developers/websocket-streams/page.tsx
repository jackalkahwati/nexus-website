export default function WebSocketStreamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            WebSocket Streams
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time data streaming with WebSocket connections. Get instant updates about your fleet,
            sensor data, and system events.
          </p>
        </div>

        {/* Connection Guide */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Connection Guide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">WebSocket URL</h3>
                <p className="text-gray-300 mb-4">
                  Connect to our WebSocket server using the following URL:
                </p>
                <div className="bg-gray-900/50 rounded p-4">
                  <code className="text-sm text-gray-300">
                    wss://stream.lattis-nexus.com/v1
                  </code>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Authentication</h3>
                <p className="text-gray-300 mb-4">
                  Include your API key in the connection headers:
                </p>
                <div className="bg-gray-900/50 rounded p-4">
                  <pre className="text-sm text-gray-300">{`{
  "Authorization": "Bearer YOUR_API_KEY"
}`}</pre>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Connection Example</h3>
              <div className="bg-gray-900/50 rounded p-4">
                <pre className="text-sm text-gray-300">{`// JavaScript Example
const ws = new WebSocket('wss://stream.lattis-nexus.com/v1');

ws.onopen = () => {
  // Subscribe to vehicle updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'vehicle_updates',
    fleet_id: 'your_fleet_id'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received update:', data);
};`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Available Streams */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Available Streams</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                channel: "vehicle_updates",
                description: "Real-time vehicle status and location updates",
                example: {
                  type: "vehicle_update",
                  vehicle_id: "v_123",
                  status: "active",
                  location: { lat: 37.7749, lng: -122.4194 },
                  timestamp: "2024-02-20T15:30:00Z"
                }
              },
              {
                channel: "sensor_data",
                description: "Live sensor readings and telemetry data",
                example: {
                  type: "sensor_reading",
                  sensor_id: "s_456",
                  readings: {
                    temperature: 25.4,
                    humidity: 65,
                    pressure: 1013.2
                  },
                  timestamp: "2024-02-20T15:30:00Z"
                }
              },
              {
                channel: "system_events",
                description: "System-wide events and notifications",
                example: {
                  type: "system_event",
                  event_id: "evt_789",
                  severity: "info",
                  message: "Fleet maintenance scheduled",
                  timestamp: "2024-02-20T15:30:00Z"
                }
              },
              {
                channel: "analytics_stream",
                description: "Real-time analytics and metrics",
                example: {
                  type: "analytics_update",
                  metric: "fleet_utilization",
                  value: 85.5,
                  unit: "percent",
                  timestamp: "2024-02-20T15:30:00Z"
                }
              }
            ].map((stream, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">
                  {stream.channel}
                </h3>
                <p className="text-gray-300 mb-4">{stream.description}</p>
                <div className="bg-gray-900/50 rounded p-4">
                  <pre className="text-sm text-gray-300">
                    {JSON.stringify(stream.example, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">Best Practices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Connection Management",
                description: "Implement automatic reconnection with exponential backoff"
              },
              {
                title: "Error Handling",
                description: "Handle connection errors and message parsing gracefully"
              },
              {
                title: "Message Processing",
                description: "Process messages asynchronously to prevent blocking"
              },
              {
                title: "Rate Limiting",
                description: "Respect rate limits and implement throttling when needed"
              },
              {
                title: "Data Validation",
                description: "Validate incoming messages against expected schemas"
              },
              {
                title: "Connection State",
                description: "Monitor connection health with heartbeat messages"
              }
            ].map((practice, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-cyan-400">{practice.title}</h3>
                <p className="text-gray-300">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Try It Out</h2>
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px] rounded-lg">
            <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Launch WebSocket Playground
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 