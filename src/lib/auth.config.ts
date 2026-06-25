import type { NextAuthConfig } from "next-auth";

// Configuration "edge-safe" : pas de provider Credentials ni d'accès Prisma/bcrypt ici,
// pour pouvoir être importée par le middleware (runtime Edge).
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CITIZEN" | "ADMIN";
      }
      return session;
    },
  },
  providers: [],
};
