import { NextRequest, NextResponse } from 'next/server'

// export const config = {
//   matcher: ['/*'],
// }

export function middleware(req: NextRequest): NextResponse {
  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl
  console.log(`middleware: ${url.pathname}`)
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (
      user === process.env.NEXT_SECRET_BASIC_AUTH_USER &&
      pwd === process.env.NEXT_SECRET_BASIC_AUTH_PASSWORD
    ) {
      return NextResponse.next()
    }
  }
  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}
