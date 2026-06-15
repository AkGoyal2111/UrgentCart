import { AuthUser, AuthResult, TokenResponse } from './types';

const DEFAULT_USER_ID = 'default-user';

// In-memory user store for local development — persists across requests within the same server session
const registeredUsers: Map<string, { username: string; email?: string; name?: string }> = new Map();

// Pre-register demo user so demo login always works
registeredUsers.set('demo', { username: 'demo', email: 'demo@urgentcart.com', name: 'Demo User' });

/**
 * Local development auth: skips real Cognito verification.
 * Accepts tokens in format "dev-token-{userId}" and extracts userId.
 * Falls back to 'default-user' if no auth header present.
 */
export function authenticateLocal(authHeader: string | null): AuthResult {
  if (!authHeader) {
    return {
      authenticated: true,
      user: { userId: DEFAULT_USER_ID, name: 'Dev User' },
    };
  }

  const token = authHeader.replace('Bearer ', '');

  if (token.startsWith('dev-token-')) {
    const userId = token.replace('dev-token-', '');
    return {
      authenticated: true,
      user: { userId: userId || DEFAULT_USER_ID, name: 'Dev User' },
    };
  }

  // In local mode, accept any token and default to default-user
  return {
    authenticated: true,
    user: { userId: DEFAULT_USER_ID, name: 'Dev User' },
  };
}

/**
 * Mock signup for local development. Registers the user so they can login later.
 */
export function localSignup(username?: string, email?: string, name?: string): { userSub: string; codeDeliveryDetails: string } {
  const userId = username || DEFAULT_USER_ID;
  registeredUsers.set(userId, { username: userId, email, name });
  return {
    userSub: userId,
    codeDeliveryDetails: 'Local mode - no verification needed',
  };
}

/**
 * Mock login for local development. Accepts any username in local mode.
 * In production (cognito mode), real auth handles this.
 */
export function localLogin(username: string): TokenResponse {
  const userId = username || DEFAULT_USER_ID;

  // In local mode, always allow login (no registration check)
  // Real auth validation happens via Cognito when AUTH_MODE=cognito
  return {
    accessToken: `dev-token-${userId}`,
    idToken: `dev-id-token-${userId}`,
    refreshToken: `dev-refresh-token-${userId}`,
    expiresIn: 3600,
  };
}

/**
 * Mock token refresh for local development.
 */
export function localRefresh(refreshToken: string): TokenResponse {
  // Extract userId from refresh token if possible
  const userId = refreshToken.startsWith('dev-refresh-token-')
    ? refreshToken.replace('dev-refresh-token-', '')
    : DEFAULT_USER_ID;

  return {
    accessToken: `dev-token-${userId}`,
    idToken: `dev-id-token-${userId}`,
    refreshToken: refreshToken,
    expiresIn: 3600,
  };
}

/**
 * Mock get user for local development.
 */
export function localGetUser(): AuthUser {
  return {
    userId: DEFAULT_USER_ID,
    name: 'Dev User',
    email: 'dev@example.com',
    phone: '+1234567890',
  };
}

/**
 * Check if a user is registered (for testing purposes).
 */
export function isUserRegistered(username: string): boolean {
  return registeredUsers.has(username);
}
