import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

let handler = NextAuth(authOptions)

export {handler as GET, handler as POST}