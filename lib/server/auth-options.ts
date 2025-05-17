import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma";
import { authOptions as baseAuthOptions } from "../auth";
import { NextAuthOptions } from "next-auth";

// This module should only be imported in server components or API routes
if (typeof window !== 'undefined') {
  throw new Error('This module should only be imported on the server side');
}

// Get full auth options for server-side usage that includes the PrismaAdapter
export function getServerAuthOptions(): NextAuthOptions {
  return {
    ...baseAuthOptions,
    adapter: PrismaAdapter(prisma),
  };
}