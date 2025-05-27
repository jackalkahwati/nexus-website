'use client';

import { getSession } from 'next-auth/react';

/**
 * Configuration options for the API client
 */
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number;
  next?: { revalidate?: number, tags?: string[] };
}

/**
 * Response from the API client
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Error from the API client
 */
export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: any;

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Base API client for Nexus applications
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
    this.defaultTimeout = config.timeout || 30000; // 30 seconds default
  }

  /**
   * Get authentication headers using next-auth
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const session = await getSession();
      const headers: Record<string, string> = {};

      if (session?.user) {
        headers['Authorization'] = `Bearer ${session.user}`;
      }

      return headers;
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return {};
    }
  }

  /**
   * Create a controller with timeout
   */
  private createControllerWithTimeout(timeout: number): { controller: AbortController; timeoutId: NodeJS.Timeout } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutId };
  }

  /**
   * Process the response and handle errors
   */
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If the response is not JSON, use the status text as error data
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || `API error: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText,
        errorData
      );
    }

    // For 204 No Content responses, return null as data
    if (response.status === 204) {
      return {
        data: null as unknown as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    }

    const data = await response.json() as T;

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  /**
   * Make a request to the API
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    const timeout = options?.timeout || this.defaultTimeout;
    const { controller, timeoutId } = this.createControllerWithTimeout(timeout);

    try {
      // Get auth headers
      const authHeaders = await this.getAuthHeaders();

      // Prepare headers
      const headers = {
        ...this.defaultHeaders,
        ...authHeaders,
        ...options?.headers,
      };

      // Add CSRF token if in browser
      if (typeof window !== 'undefined') {
        const csrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('csrf-token='))
          ?.split('=')[1];

        if (csrfToken) {
          headers['x-csrf-token'] = csrfToken;
        }
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      // Add body for non-GET requests
      if (method !== 'GET' && data !== undefined) {
        requestOptions.body = JSON.stringify(data);
      }

      // Add next.js specific options
      if (options?.next) {
        requestOptions.next = options.next;
      } else if (options?.revalidate !== undefined || options?.tags) {
        requestOptions.next = {
          revalidate: options.revalidate,
          tags: options.tags,
        };
      }

      // Add cache option
      if (options?.cache) {
        requestOptions.cache = options.cache;
      }

      // Make the request
      const response = await fetch(url.toString(), requestOptions);

      // Process the response
      return await this.processResponse<T>(response);
    } catch (error) {
      // Handle fetch errors
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(
            `Request timed out after ${timeout}ms`,
            408,
            'Request Timeout',
            { originalError: error }
          );
        }

        throw new ApiError(
          `Network error: ${error.message}`,
          0,
          'Network Error',
          { originalError: error }
        );
      }

      throw new ApiError(
        'Unknown error occurred',
        0,
        'Unknown Error',
        { originalError: error }
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>, options?: RequestOptions): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await this.request<T>('GET', url.pathname + url.search, undefined, options);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('POST', endpoint, data, options);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('PUT', endpoint, data, options);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('PATCH', endpoint, data, options);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.request<T>('DELETE', endpoint, undefined, options);
    return response.data;
  }
}