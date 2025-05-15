import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { db } from "./prisma";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope:
            "openid profile email Files.Read.All Sites.Read.All offline_access",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Adicione explicitamente
  session: {
    strategy: "jwt", // Força uso de JWT para compatibilidade com middleware
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persiste access_token no token JWT
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Passa accessToken para a sessão
      session.accessToken = token.accessToken;
      if(session.user){
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
