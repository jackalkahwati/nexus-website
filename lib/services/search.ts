import { Client } from '@elastic/elasticsearch'
import { env } from '@/lib/config/env'
import logger from '@/lib/logger'

export interface SearchConfig {
  node: string
  username?: string
  password?: string
  index: string
}

const defaultConfig: SearchConfig = {
  node: 'http://localhost:9200',
  index: 'default'
}

export class SearchService {
  private client: Client
  private config: SearchConfig

  constructor(config?: Partial<SearchConfig>) {
    this.config = {
      ...defaultConfig,
      ...env?.elasticsearch,
      ...config
    }

    this.client = new Client({
      node: this.config.node,
      auth: this.config.username ? {
        username: this.config.username,
        password: this.config.password || ''
      } : undefined
    })
  }

  async search(query: string) {
    try {
      if (!query) {
        throw new Error('Search query cannot be empty')
      }

      logger.debug('Performing search', { query, index: this.config.index })
      
      const response = await this.client.search({
        index: this.config.index,
        query: {
          multi_match: {
            query,
            fields: ['title', 'content', 'tags']
          }
        }
      })

      logger.debug('Search completed', { 
        hits: response.hits.total,
        index: this.config.index 
      })

      return response.hits.hits
    } catch (error) {
      logger.error('Search operation failed', { 
        error,
        query,
        index: this.config.index
      })
      throw error
    }
  }

  async index(document: any) {
    try {
      if (!document) {
        throw new Error('Document cannot be empty')
      }

      logger.debug('Indexing document', { index: this.config.index })
      
      const response = await this.client.index({
        index: this.config.index,
        document
      })

      logger.debug('Document indexed successfully', {
        id: response._id,
        index: this.config.index
      })

      return response
    } catch (error) {
      logger.error('Document indexing failed', {
        error,
        index: this.config.index
      })
      throw error
    }
  }

  async delete(id: string) {
    try {
      if (!id) {
        throw new Error('Document ID cannot be empty')
      }

      logger.debug('Deleting document', { id, index: this.config.index })
      
      const response = await this.client.delete({
        index: this.config.index,
        id
      })

      logger.debug('Document deleted successfully', {
        id,
        index: this.config.index
      })

      return response
    } catch (error) {
      logger.error('Document deletion failed', {
        error,
        id,
        index: this.config.index
      })
      throw error
    }
  }
}

// Export a singleton instance with default config
export const searchService = new SearchService()
