export const dynamic = 'force-dynamic';

import NextAuth, { NextAuthOptions, Session as NextAuthSession, TokenSet } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { 
            id: user.id.toString(), 
            email: user.email,
            name: user.name || "",
            username: user.username,
            role: user.role 
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: NextAuthSession; token: any }) {
      if (session?.user) {
        // token.sub is the default subject claim for JWT
        session.user.id = (token.sub || token.id) as string;
        // Attach custom properties if present on token
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        // copy custom properties from user to token
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    }
  },
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/", // Optional: your custom login page
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };