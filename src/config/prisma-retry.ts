import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Функция для создания Prisma клиента с retry логикой
function createPrismaClient() {
    return new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
        // Настройки для MongoDB Atlas
        // __internal: {
        //     engine: {
        //         binaryTargets: ['rhel-openssl-1.0.x'],
        //     },
        // },
    })
}

// Функция для retry подключения
async function connectWithRetry(maxRetries = 3): Promise<PrismaClient> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const client = createPrismaClient()
            // Тестируем подключение
            await client.$connect()
            console.log(`Prisma connected successfully (attempt ${i + 1})`)
            return client
        } catch (error) {
            console.error(`Prisma connection attempt ${i + 1} failed:`, error)
            if (i === maxRetries - 1) {
                throw error
            }
            // Ждем перед следующей попыткой
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
    }
    throw new Error('Failed to connect to Prisma after all retries')
}

export const prisma =
    globalForPrisma.prisma ||
    (process.env.NODE_ENV === 'production' 
        ? await connectWithRetry()
        : createPrismaClient()
    )

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
