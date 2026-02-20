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
      if (!url.searchParams.has('connection_limit')) url.searchParams.set('connection_limit', '1')
      if (!url.searchParams.has('connect_timeout')) url.searchParams.set('connect_timeout', '20')
      if (!url.searchParams.has('pool_timeout')) url.searchParams.set('pool_timeout', '20')
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
