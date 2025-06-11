import  {   User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {AuthOptions} from "next-auth";
import { prisma } from "./prisma";



export const authOption: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      
      if(dbUser) return true

     
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });

        if(newUser) return true

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          token.id = dbUser.id; 
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; 
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
