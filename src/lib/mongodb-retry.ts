import { MongoClient } from 'mongodb'

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

const uri = process.env.DATABASE_URL

// Конфигурация с retry логикой для Vercel
const options = {
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 15000,
  maxIdleTimeMS: 30000,
  bufferMaxEntries: 0,
  retryWrites: true,
  retryReads: true,
  // Настройки для MongoDB Atlas
  ssl: true,
  authSource: 'admin',
  // Дополнительные настройки для стабильности
  heartbeatFrequencyMS: 10000,
  minHeartbeatFrequencyMS: 5000,
}

let clientPromise: Promise<MongoClient>

// Функция для retry подключения
async function connectWithRetry(uri: string, options: object, maxRetries = 3): Promise<MongoClient> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = new MongoClient(uri, options)
      await client.connect()
      console.log(`MongoDB connected successfully (attempt ${i + 1})`)
      return client
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error)
      if (i === maxRetries - 1) {
        throw error
      }
      // Ждем перед следующей попыткой
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error('Failed to connect to MongoDB after all retries')
}

if (process.env.NODE_ENV === 'development') {
  // В development режиме используем глобальную переменную
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectWithRetry(uri, options)
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // В production режиме создаем новое подключение с retry
  clientPromise = connectWithRetry(uri, options)
}

export default clientPromise
