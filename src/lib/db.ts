import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) return rawUrl

  try {
    const url = new URL(rawUrl)
    const isSupabasePooler =
      url.hostname.endsWith('pooler.supabase.com') && url.port === '6543'

    if (isSupabasePooler) {
      if (!url.searchParams.has('pgbouncer')) url.searchParams.set('pgbouncer', 'true')
      if (!url.searchParams.has('sslmode')) url.searchParams.set('sslmode', 'require')
      const connectionLimit = Number(url.searchParams.get('connection_limit') ?? '')
      const connectTimeout = Number(url.searchParams.get('connect_timeout') ?? '')
      const poolTimeout = Number(url.searchParams.get('pool_timeout') ?? '')

      // In dev/staging, very low limits (like 1) trigger frequent P2024 timeouts.
      if (!Number.isFinite(connectionLimit) || connectionLimit < 3) {
        url.searchParams.set('connection_limit', '3')
      }
      if (!Number.isFinite(connectTimeout) || connectTimeout < 20) {
        url.searchParams.set('connect_timeout', '20')
      }
      if (!Number.isFinite(poolTimeout) || poolTimeout < 40) {
        url.searchParams.set('pool_timeout', '40')
      }
    }

    return url.toString()
  } catch {
    return rawUrl
  }
}

const prismaOptions: Prisma.PrismaClientOptions = {
  log: process.env.PRISMA_QUERY_LOG === 'true' ? ['query', 'error'] : ['error'],
}

const dbUrl = getDatabaseUrl()
if (dbUrl) {
  prismaOptions.datasources = {
    db: {
      url: dbUrl,
    },
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions)


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
