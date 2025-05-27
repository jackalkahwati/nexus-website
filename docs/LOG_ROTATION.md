# Log Rotation System

A modular, type-safe log rotation system for managing log files in Node.js applications. This system provides automatic log file rotation, compression, and cleanup with configurable settings and monitoring capabilities.

## Features

- Size-based log file rotation
- Automatic compression of rotated logs using gzip
- Configurable retention policy
- Scheduled rotation checks
- Detailed file statistics and monitoring
- Error handling and recovery
- Concurrent operation support
- TypeScript support with full type safety

## Installation

```bash
npm install @aws-sdk/client-cloudwatch-logs nanoid winston
```

## Basic Usage

```typescript
import { LogRotator } from 'lib/utils/log-rotation'

// Create instance with custom configuration
const rotator = new LogRotator({
  maxSize: 5 * 1024 * 1024,  // 5MB
  maxFiles: 10,
  compress: true,
  logDir: 'logs',
  filePattern: /^app.*\.log$/
})

// Start automatic rotation (every hour by default)
rotator.scheduleRotation()

// Or manually check and rotate
await rotator.checkAndRotate()
```

## Configuration

```typescript
interface RotationConfig {
  maxSize: number        // Maximum size in bytes before rotation
  maxFiles: number       // Maximum number of archived log files to keep
  compress: boolean      // Whether to compress rotated logs
  logDir: string        // Directory containing log files
  filePattern: RegExp   // Pattern to match log files
}
```

### Default Configuration

```typescript
const DEFAULT_CONFIG = {
  maxSize: 5 * 1024 * 1024,  // 5MB
  maxFiles: 5,
  compress: true,
  logDir: 'logs',
  filePattern: /^.*\.log$/
}
```

## API Reference

### Core Methods

```typescript
// Check and rotate logs if needed
await rotator.checkAndRotate()

// Schedule automatic rotation
const interval = rotator.scheduleRotation(3600000) // 1 hour

// Stop scheduled rotation
rotator.stopRotation()

// Run rotation immediately
await rotator.runNow()
```

### Configuration Management

```typescript
// Get current configuration
const config = rotator.getConfig()

// Update configuration
rotator.updateConfig({
  maxFiles: 10,
  compress: false
})
```

### Statistics and Monitoring

```typescript
// Get comprehensive stats
const stats = await rotator.getStats()

// Get total size of all logs
const totalSize = await rotator.getTotalSize()

// Get number of log files
const fileCount = await rotator.getFileCount()

// Check if directory is empty
const isEmpty = await rotator.isEmpty()

// Get files exceeding size limit
const largeFiles = await rotator.getFilesExceedingSize()

// Get files older than date
const oldFiles = await rotator.getFilesOlderThan(new Date('2024-01-01'))
```

## File Naming

Rotated log files follow this naming pattern:
- Original: `app.log`
- Rotated: `app-2024-01-01T00-00-00Z.log`
- Compressed: `app-2024-01-01T00-00-00Z.log.gz`

## Best Practices

1. **Directory Structure**
   ```
   logs/
   ├── app.log           # Current log file
   ├── app-20240101.gz   # Rotated and compressed
   └── app-20240102.gz   # Rotated and compressed
   ```

2. **Error Handling**
   ```typescript
   try {
     await rotator.checkAndRotate()
   } catch (error) {
     console.error('Rotation failed:', error)
   }
   ```

3. **Monitoring**
   ```typescript
   // Monitor directory size
   const stats = await rotator.getStats()
   if (stats.totalSize > 1024 * 1024 * 100) { // 100MB
     console.warn('Log directory getting large')
   }
   ```

4. **Scheduling**
   ```typescript
   // Schedule during off-peak hours
   const HOUR = 3600000
   rotator.scheduleRotation(HOUR * 4) // Every 4 hours
   ```

## Performance Considerations

1. **File Size Checks**
   - Only performed when needed
   - Cached where possible
   - Asynchronous operations

2. **Compression**
   - Performed after rotation
   - Uses streaming for memory efficiency
   - Configurable and optional

3. **Concurrent Operations**
   - Thread-safe file operations
   - Atomic renames
   - Error recovery

## Error Handling

The system handles various error conditions:
- Missing directories are created automatically
- File access errors are logged but don't crash the application
- Compression failures fall back to uncompressed storage
- Concurrent rotation requests are handled safely

## Integration with Winston

```typescript
import winston from 'winston'
import { LogRotator } from 'lib/utils/log-rotation'

const rotator = new LogRotator({
  logDir: 'logs',
  maxSize: 5 * 1024 * 1024
})

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
      maxsize: rotator.getConfig().maxSize
    })
  ]
})

// Schedule rotation checks
rotator.scheduleRotation()
```

## Testing

Run the test suite:
```bash
npm test lib/utils/log-rotation/__tests__
```

## Troubleshooting

1. **Files not rotating**
   - Check file permissions
   - Verify maxSize configuration
   - Ensure directory is writable

2. **Compression issues**
   - Check disk space
   - Verify gzip is available
   - Check file permissions

3. **Performance problems**
   - Adjust check frequency
   - Increase maxSize
   - Consider disabling compression

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License
