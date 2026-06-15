import { type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { loginSchema } from '@/schemas/auth.schema';
import { successResponse, errorResponse } from '@/lib/api-response';
import * as cognitoService from '@/lib/auth/cognitoService';
import { localLogin } from '@/lib/auth/localAuth';

function isLocalMode(): boolean {
  return process.env.AUTH_MODE !== 'cognito';
}

/** Ensure phone is in E.164 format (+91XXXXXXXXXX) for Cognito */
function formatUsername(username: string): string {
  let cleaned = username.replace(/[\s\-()]/g, '');
  // If it looks like a phone number, format it
  if (/^\d{10}$/.test(cleaned)) return `+91${cleaned}`;
  if (/^91\d{10}$/.test(cleaned)) return `+${cleaned}`;
  if (cleaned.startsWith('+')) return cleaned;
  // Otherwise return as-is (could be email or username)
  return username;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    if (isLocalMode()) {
      try {
        const tokens = localLogin(validated.username);
        return successResponse(tokens);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
          return errorResponse('USER_NOT_FOUND', 'Account not found. Please sign up first.', 401);
        }
        throw error;
      }
    }

    // Format username for Cognito
    const formattedUsername = formatUsername(validated.username);
    const tokens = await cognitoService.login({
      ...validated,
      username: formattedUsername,
    });
    return successResponse(tokens);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return errorResponse('VALIDATION_ERROR', 'Invalid request body', 400, details);
    }

    // Handle Cognito-specific errors
    const cognitoError = error as { name?: string; message?: string };
    if (cognitoError.name === 'NotAuthorizedException') {
      return errorResponse('INVALID_CREDENTIALS', 'Incorrect phone number or password', 401);
    }
    if (cognitoError.name === 'UserNotFoundException') {
      return errorResponse('USER_NOT_FOUND', 'Account not found. Please sign up first.', 401);
    }
    if (cognitoError.name === 'UserNotConfirmedException') {
      return errorResponse('USER_NOT_CONFIRMED', 'Please verify your account first', 403);
    }

    console.error('[auth/login] Unexpected error:', error);
    return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500);
  }
}
