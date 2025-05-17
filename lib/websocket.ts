import { EventEmitter } from 'events'

export class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 1000
  private url: string
  private isConnecting = false

  constructor(url: string) {
    super()
    this.url = url
  }

  connect() {
    if (this.isConnecting) return
    this.isConnecting = true

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.emit('connected')
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.emit('message', data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        this.isConnecting = false
        this.emit('disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        this.isConnecting = false
        this.emit('error', error)
      }
    } catch (error) {
      this.isConnecting = false
      console.error('Error creating WebSocket connection:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('maxReconnectAttemptsReached')
      return
    }

    this.reconnectAttempts++
    const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1)

    setTimeout(() => {
      this.connect()
    }, timeout)
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.emit('error', new Error('WebSocket is not connected'))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
} 