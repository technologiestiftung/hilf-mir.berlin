export const getBaseUrl = (): string => {
  const isProd = process.env.NODE_ENV === 'production'
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'
  return isProd
    ? baseUrl
    : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : baseUrl
}
