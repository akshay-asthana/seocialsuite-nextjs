// "use client";
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    // Add other authentication providers if needed
  ],
  secret: process.env.NEXTAUTH_SECRET,
  options: {
    session: {
      strategy: "jwt",
    },
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // console.log("JWT CALLBACK:", token);
      // console.log("USER", user);
      // console.log("ACCOUNT", account);
      // console.log("PROFILE", profile);
      // console.log("jwt callback");
      // console.log("Trigger in jwt: ", trigger);
      // console.log("Session in jwt: ", session);

      if (account && profile) {
        // account and profile only present when sign in happens
        // console.log("Signin in token");
        token.account = account;
        token.profile = profile;
        // console.log("ACCOUNT: ", account);
        // console.log("PROFILE: ", profile);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
            body: JSON.stringify({
              session: {
                user: {
                  name: profile.name,
                  email: profile.email,
                  image: profile.picture,
                },
              },
              token,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // console.log("SUCCESS: ", data);
          const sessionData = {
            user: data.payload,
            jwt: data.token,
            expires: data.exp,
          };

          token.sessionData = sessionData;
          return token;
        }
      } else if (trigger === "update" && session?.user) {
        token.sessionData = session;
        return token;
      }
      // console.log(token);
      else {
        return token;
      }
    },
    async session({ session, token }) {
      if (token && token.sessionData) return token.sessionData;
      else return session;
    },
  },
  // theme: "light",
  // debug: "true",
  // Optional: Add custom configurations, callbacks, or event handlers
});

export { handler as GET, handler as POST };
