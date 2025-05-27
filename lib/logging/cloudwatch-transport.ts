import Transport from 'winston-transport'
import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  DescribeLogStreamsCommand,
} from '@aws-sdk/client-cloudwatch-logs'

interface CloudWatchTransportOptions extends Transport.TransportStreamOptions {
  logGroupName: string
  logStreamName: string
  createLogGroup?: boolean
  createLogStream?: boolean
  submissionInterval?: number
  submissionRetryCount?: number
  awsConfig?: any
}

export class CloudWatchTransport extends Transport {
  private client: CloudWatchLogsClient
  private logGroupName: string
  private logStreamName: string
  private sequenceToken: string | undefined
  private logQueue: any[]
  private timer: NodeJS.Timeout | null
  private options: CloudWatchTransportOptions

  constructor(options: CloudWatchTransportOptions) {
    super(options)

    this.options = {
      submissionInterval: 2000, // 2 seconds
      submissionRetryCount: 3,
      ...options,
    }

    this.logGroupName = options.logGroupName
    this.logStreamName = options.logStreamName
    this.logQueue = []
    this.timer = null

    // Initialize AWS CloudWatch Logs client
    this.client = new CloudWatchLogsClient({
      region: process.env.AWS_REGION || 'us-east-1',
      ...options.awsConfig,
    })

    this.initialize()
  }

  private async initialize() {
    try {
      if (this.options.createLogGroup) {
        await this.createLogGroup()
      }

      if (this.options.createLogStream) {
        await this.createLogStream()
      }

      await this.getSequenceToken()
    } catch (error) {
      console.error('Error initializing CloudWatch transport:', error)
    }
  }

  private async createLogGroup() {
    try {
      await this.client.send(
        new CreateLogGroupCommand({
          logGroupName: this.logGroupName,
        })
      )
    } catch (error: any) {
      // Ignore if log group already exists
      if (error.name !== 'ResourceAlreadyExistsException') {
        throw error
      }
    }
  }

  private async createLogStream() {
    try {
      await this.client.send(
        new CreateLogStreamCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
        })
      )
    } catch (error: any) {
      // Ignore if log stream already exists
      if (error.name !== 'ResourceAlreadyExistsException') {
        throw error
      }
    }
  }

  private async getSequenceToken() {
    try {
      const response = await this.client.send(
        new DescribeLogStreamsCommand({
          logGroupName: this.logGroupName,
          logStreamNamePrefix: this.logStreamName,
        })
      )

      const logStream = response.logStreams?.find(
        stream => stream.logStreamName === this.logStreamName
      )

      this.sequenceToken = logStream?.uploadSequenceToken
    } catch (error) {
      console.error('Error getting sequence token:', error)
    }
  }

  private startTimer() {
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.options.submissionInterval)
    }
  }

  private async flush() {
    this.timer = null

    if (this.logQueue.length === 0) return

    const logEvents = this.logQueue.map(log => ({
      message: typeof log === 'string' ? log : JSON.stringify(log),
      timestamp: new Date().getTime(),
    }))

    this.logQueue = []

    try {
      const command = new PutLogEventsCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        logEvents,
        sequenceToken: this.sequenceToken,
      })

      const response = await this.client.send(command)
      this.sequenceToken = response.nextSequenceToken

    } catch (error: any) {
      if (error.name === 'InvalidSequenceTokenException') {
        // Retry with updated sequence token
        await this.getSequenceToken()
        await this.flush()
      } else {
        console.error('Error sending logs to CloudWatch:', error)
        // Re-queue failed logs
        this.logQueue.push(...logEvents.map(e => e.message))
      }
    }
  }

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    this.logQueue.push(info)
    this.startTimer()

    callback()
  }

  async close() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    await this.flush()
  }
}
