import NextAuth, { Profile } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDb from "@/utils/database/connectToDb";
import User from "@/model/user/userModel";

// Extend Profile type to include 'login'
interface ExtendedProfile extends Profile {
  login?: string;
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDb();
          if (!credentials?.email || !credentials.password) {
            throw new Error("Email and password are required.");
          }

          const user = await User.findOne({ email: credentials.email });
          if (!user) throw new Error("User not found.");
          if (!user.password) throw new Error("Password not set for this user.");

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) throw new Error("Invalid password.");

          return {
            id: (user._id as any).toString(),
            name: user.userName,
            email: user.email,
          };
        } catch (error) {
          console.error("Error in Credentials authorize:", error);
          throw new Error("Login failed.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, profile }) {
      await connectToDb();

      if (!user.email) return false;

      // Safely access `login` using extended profile
      const githubProfile = profile as ExtendedProfile;

      let dbUser = await User.findOne({ email: user.email });
      if (!dbUser) {
        dbUser = await User.create({
          userName: user.name || githubProfile?.login || "GitHub User",
          email: user.email,
        });
        console.log("New user created via GitHub:", user.email);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.encryptedToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "7d" }
        );
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: session.user?.name || null,
        email: session.user?.email || null,
        image: session.user?.image || null,
      };
      session.token = token.encryptedToken as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Ensure the redirect is correctly handled and go to the dashboard after login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/`; // Redirect to your dashboard after successful login
      }
      return url; // If the URL is not from the same domain, return it unchanged
    },
  },

  pages: {
    signIn: "/auth/",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
