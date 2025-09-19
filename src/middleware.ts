import { NextRequest } from "next/server"
import { auth } from "@/auth-middleware"

export default auth((req: NextRequest) => {
  // Middleware logic here if needed
  // For now, just pass through
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}