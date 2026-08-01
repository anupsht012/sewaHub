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



  databaseHooks: {

    user: {

      create: {

        after: async (user) => {

          try {

            const admins = await prisma.user.findMany({

              where: {
                role: "ADMIN",
              },

            });



            if (admins.length > 0) {

              await prisma.notification.createMany({

                data: admins.map((admin) => ({

                  userId: admin.id,

                  title:
                    "New User Registered",

                  message:
                    `${user.name} has created a new account.`,

                  type:
                    "SYSTEM_ALERT",

                  link:
                    "/admin/users",

                })),

              });

            }


          } catch (error) {

            console.error(
              "ADMIN REGISTRATION NOTIFICATION ERROR:",
              error
            );

          }

        },

      },

    },

  },



  logger: {

    level: "debug",

  },

});