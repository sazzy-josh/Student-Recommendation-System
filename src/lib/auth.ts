import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';

// Backend access tokens live for 15 minutes; refresh 30s early.
const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000;
const REFRESH_MARGIN_MS = 30 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();
    return {
      ...token,
      accessToken: data.access,
      // Backend rotates refresh tokens (ROTATE_REFRESH_TOKENS=True)
      refreshToken: data.refresh ?? token.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME_MS,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshTokenError' as const };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Auth.js v5 only reads AUTH_SECRET from the environment; the spec's env
  // files use NEXTAUTH_SECRET, so accept either.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.API_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.full_name,
            role: data.user.role,
            onboarding_complete: data.user.onboarding_complete,
            accessToken: data.access,
            refreshToken: data.refresh,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.onboarding_complete = user.onboarding_complete;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
        return token;
      }

      // Access token still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - REFRESH_MARGIN_MS) {
        return token;
      }

      // Access token expired — refresh it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      if (session.user) {
        session.user.role = token.role;
        session.user.onboarding_complete = token.onboarding_complete;
        session.user.id = token.sub ?? '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
});
