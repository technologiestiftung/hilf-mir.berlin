export const getBaseUrl = (): string => {
  const isProd = process.env.NODE_ENV === 'production'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return isProd
    ? baseUrl
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : baseUrl
}
