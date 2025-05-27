// Mock Response class
class MockResponse {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.statusText = init.statusText || 'OK'
    this.headers = new Headers(init.headers)
    this.ok = this.status >= 200 && this.status < 300
  }

  async json() {
    return Promise.resolve(this.body)
  }

  async text() {
    return Promise.resolve(JSON.stringify(this.body))
  }

  clone() {
    return new MockResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    })
  }
}

// Mock Request class
class MockRequest {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url
    this.method = init.method || 'GET'
    this.headers = new Headers(init.headers)
    this.body = init.body
  }

  async json() {
    return Promise.resolve(
      typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    )
  }

  async text() {
    return Promise.resolve(
      typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    )
  }
}

// Mock fetch function
const fetch = jest.fn().mockImplementation((url, init) => {
  const request = new MockRequest(url, init)
  return Promise.resolve(new MockResponse({ success: true }))
})

module.exports = {
  Request: MockRequest,
  Response: MockResponse,
  fetch,
  default: fetch
} 