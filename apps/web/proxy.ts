import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    return undefined;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPath = req.nextUrl.pathname.startsWith("/dashboard");
        const isLoginPath = req.nextUrl.pathname === "/login";
        const isRegisterPath = req.nextUrl.pathname === "/register";

        if (isAuthPath) {
          return !!token;
        }

        if ((isLoginPath || isRegisterPath) && token) {
          return false;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
