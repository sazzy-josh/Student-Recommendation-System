import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: 'RefreshTokenError';
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      role?: 'student' | 'admin';
      onboarding_complete?: boolean;
    };
  }

  interface User {
    role?: 'student' | 'admin';
    onboarding_complete?: boolean;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    role?: 'student' | 'admin';
    onboarding_complete?: boolean;
    error?: 'RefreshTokenError';
  }
}
