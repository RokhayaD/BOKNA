import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "CITIZEN" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      role: "CITIZEN" | "ADMIN";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CITIZEN" | "ADMIN";
  }
}
