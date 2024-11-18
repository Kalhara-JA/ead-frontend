import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from "@prisma/client"; // Temporarily commented out
import bcrypt from "bcrypt";

// const prisma = new PrismaClient(); // Temporarily commented out

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    username: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email and password are required.");
      }

      // Sample user object
      const mockUser = {
        id: "1",
        email: credentials.email,
        username: "TemporaryUser",
      };

      return {
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        name: mockUser.username,
      };

      //for database checks
      /*
        // Find user in database
        const user = await prisma.user.findUnique({
          where: { userEmail: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // Verify password
        if (user.password) {
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isValid) {
            return {
              id: user.userId.toString(),
              email: user.userEmail,
              username: user.username,
            };
          }
        }

        throw new Error("Invalid email or password.");
        */
    },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
        session.user = {
            id: token.id as string,
            email: token.email as string,
            name: token.username as string, 
            username: token.username as string, 
        };
        return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = (user as any).id; 
            token.username = (user as any).name; 
        }
        return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};
