import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `username=${credentials.email}&password=${credentials.password}`,
            },
          );

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
            {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            },
          );

          if (!userRes.ok) {
            return null;
          }

          const user = await userRes.json();

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            dob: user.dob,
            accessToken: data.access_token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "accessToken" in user) {
        token.accessToken = user.accessToken;
        token.dob = user.dob;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.dob = token.dob as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
