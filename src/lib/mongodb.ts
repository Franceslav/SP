import { MongoClient } from 'mongodb'

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

const uri = process.env.DATABASE_URL
const options = {
  maxPoolSize: 10, // Поддерживать до 10 сокетов
  serverSelectionTimeoutMS: 5000, // Пытаться подключиться 5 секунд
  socketTimeoutMS: 45000, // Закрывать сокеты через 45 секунд неактивности
  bufferMaxEntries: 0, // Отключить буферизацию
  retryWrites: true,
  retryReads: true,
  // Настройки для Vercel
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  // Настройки для MongoDB Atlas
  ssl: true,
  authSource: 'admin',
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // В development режиме используем глобальную переменную
  // чтобы избежать множественных подключений при hot reload
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // В production режиме создаем новое подключение
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
