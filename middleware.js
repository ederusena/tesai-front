import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('tesai_auth_token')?.value
  const userRole = request.cookies.get('tesai_role')?.value

  // 1. Proteger rotas do /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!authToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Se for operador, só pode acessar Pedidos e WhatsApp (Omnichannel)
    if (userRole === 'operator') {
      const isOperatorAllowed = 
        pathname.startsWith('/dashboard/pedidos') || 
        pathname.startsWith('/dashboard/omnichannel')

      if (!isOperatorAllowed) {
        return NextResponse.redirect(new URL('/dashboard/pedidos', request.url))
      }
    }
  }

  // 2. Se já estiver logado e tentar acessar /login, redireciona para o painel correspondente
  if (pathname === '/login' && authToken) {
    if (userRole === 'operator') {
      return NextResponse.redirect(new URL('/dashboard/pedidos', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em /dashboard e /login
     */
    '/dashboard/:path*',
    '/login',
  ],
}
