export interface DatabaseConfig {
  postgres: {
    url: string
    ssl?: boolean
  }
  mongodb: {
    uri: string
  }
  redis: {
    host: string
    port: number
    url?: string
  }
}

export interface LogEntry {
  level: string
  message: string
  meta?: Record<string, any>
  userId?: string
  ip?: string
  userAgent?: string
  endpoint?: string
  method?: string
  statusCode?: number
  responseTime?: number
  timestamp: Date
}