export default function SensorManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
            Sensor Management
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive sensor data management and analytics platform for autonomous operations.
            Collect, process, and analyze sensor data in real-time to enable intelligent decision making.
          </p>
        </div>

        {/* Core Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {[
            {
              title: "Data Collection",
              description: "Collect and aggregate data from multiple sensor types.",
              features: [
                "Multi-sensor integration",
                "Real-time data streaming",
                "Automated data collection",
                "Custom sensor support"
              ]
            },
            {
              title: "Data Processing",
              description: "Process and analyze sensor data in real-time.",
              features: [
                "Real-time processing",
                "Data filtering",
                "Signal processing",
                "Noise reduction"
              ]
            },
            {
              title: "Data Analytics",
              description: "Extract actionable insights from sensor data.",
              features: [
                "Pattern recognition",
                "Anomaly detection",
                "Predictive analytics",
                "Performance monitoring"
              ]
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-200 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">{feature.title}</h2>
              <p className="text-gray-300 mb-6">{feature.description}</p>
              <ul className="space-y-3">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sensor Types */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Supported Sensor Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: "LiDAR",
                description: "3D point cloud data for precise object detection and mapping"
              },
              {
                type: "Cameras",
                description: "Visual data for object recognition and scene understanding"
              },
              {
                type: "Radar",
                description: "All-weather object detection and velocity measurement"
              },
              {
                type: "IMU",
                description: "Motion and orientation tracking for precise positioning"
              },
              {
                type: "GPS/GNSS",
                description: "Global positioning and navigation data"
              },
              {
                type: "Ultrasonic",
                description: "Short-range obstacle detection and proximity sensing"
              },
              {
                type: "Environmental",
                description: "Temperature, humidity, and atmospheric conditions"
              },
              {
                type: "Thermal",
                description: "Heat detection and night vision capabilities"
              }
            ].map((sensor, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-orange-400">{sensor.type}</h3>
                <p className="text-gray-300 text-sm">{sensor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Advanced Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Sensor Fusion</h3>
                <p className="text-gray-300">
                  Combine data from multiple sensors to create a comprehensive understanding of the environment.
                  Enable more accurate and reliable autonomous operations.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Calibration Management</h3>
                <p className="text-gray-300">
                  Automated sensor calibration and alignment tools to ensure accurate data collection.
                  Monitor and maintain sensor performance over time.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Health Monitoring</h3>
                <p className="text-gray-300">
                  Continuous monitoring of sensor health and performance metrics.
                  Proactive maintenance recommendations and fault detection.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Data Quality</h3>
                <p className="text-gray-300">
                  Advanced data validation and quality assurance tools.
                  Ensure reliable and accurate sensor data for critical operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration */}
        <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Easy Integration</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "API Access",
                description: "RESTful API for seamless integration with existing systems"
              },
              {
                title: "SDK Support",
                description: "Development tools for custom sensor integration"
              },
              {
                title: "Data Export",
                description: "Flexible data export options in multiple formats"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold mb-3 text-orange-400">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 p-[2px] rounded-lg">
            <button className="px-8 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
                Get Started
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 