import { Headers, Request, Response } from 'node-fetch'

export class NextRequest extends Request {
  private _nextUrl: URL

  constructor(input: string | Request, init?: RequestInit) {
    super(input, init)
    this._nextUrl = new URL(typeof input === 'string' ? input : input.url)
  }

  get nextUrl(): URL {
    return this._nextUrl
  }

  get cookies(): {
    get: (name: string) => string | undefined
    getAll: () => Array<{ name: string; value: string }>
  } {
    return {
      get: (name: string) => {
        const cookie = this.headers.get('cookie')
        if (!cookie) return undefined
        const match = cookie.match(new RegExp(`${name}=([^;]+)`))
        return match ? match[1] : undefined
      },
      getAll: () => {
        const cookie = this.headers.get('cookie')
        if (!cookie) return []
        return cookie.split(';').map(c => {
          const [name, value] = c.trim().split('=')
          return { name, value }
        })
      }
    }
  }
}

export class NextResponse extends Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init)
  }

  static json(data: any, init?: ResponseInit): NextResponse {
    const response = new NextResponse(JSON.stringify(data), {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  static redirect(url: string | URL, init?: number | ResponseInit): NextResponse {
    const status = typeof init === 'number' ? init : init?.status || 307
    const response = new NextResponse(null, {
      ...init,
      status,
      headers: {
        ...init?.headers,
        Location: url.toString()
      }
    })
    return response
  }

  get cookies(): {
    get: (name: string) => string | undefined
    getAll: () => Array<{ name: string; value: string }>
  } {
    return {
      get: (name: string) => {
        const cookie = this.headers.get('set-cookie')
        if (!cookie) return undefined
        const match = cookie.match(new RegExp(`${name}=([^;]+)`))
        return match ? match[1] : undefined
      },
      getAll: () => {
        const cookie = this.headers.get('set-cookie')
        if (!cookie) return []
        return cookie.split(',').map(c => {
          const [name, value] = c.trim().split('=')
          return { name, value }
        })
      }
    }
  }
}

export { Headers } 