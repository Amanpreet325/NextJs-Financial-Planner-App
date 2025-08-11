import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
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
            role: user.role 
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        // @ts-ignore - Add role to session
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore - Add role to token from user
        token.role = user.role;
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