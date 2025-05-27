import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma";
import { authOptions as baseAuthOptions } from "../auth";

// Server-side only auth options that include the PrismaAdapter
export const getServerAuthConfig = () => {
  return {
    ...baseAuthOptions,
    adapter: PrismaAdapter(prisma),
  };
};