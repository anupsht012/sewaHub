import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    "http://localhost:3000",
    "https://sewahubnepal.vercel.app",
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: true,
      },
    },
  },

  logger: {
    level: "debug",
  },

});