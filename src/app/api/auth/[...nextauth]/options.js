import GithubProvider from "next-auth/providers/github";

import GoogleProvider from "next-auth/providers/google";
import User from "../../../models/User";

export const options = {
  providers: [
    GithubProvider({
      profile(profile) {
        console.log("profile Github", profile);

        let userRole = "github user";
        if (profile?.email === "amardeepranjan911@gmail.com") {
          userRole = "admin";
        }
        return {
          ...profile,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("profile google", profile);
        let userRole = "google user";
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      //I want to save the user data accoiring to user schema

      try {
        // Extract user details from the profile
        const { name, email, picture, role } = user;
        console.log(name);
        console.log(email);
        console.log(picture);
        console.log(role);
        // Check if the user already exists in your database
        let existingUser = await User.findOne({ email });

        // If the user doesn't exist, create a new user
        if (!existingUser) {
          const newUser = new User({
            email,
            name,
            picture,
            role,
            // You may want to add more fields here based on your user schema
          });
          await newUser.save();
          console.log("New user created:", newUser);
        } else {
          console.log("User already exists:", existingUser);
        }
      } catch (error) {
        console.error("Error saving user:", error);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || null; // Set role to null if not defined
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
