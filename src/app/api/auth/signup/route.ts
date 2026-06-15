import { type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { signupSchema } from '@/schemas/auth.schema';
import { successResponse, errorResponse } from '@/lib/api-response';
import * as cognitoService from '@/lib/auth/cognitoService';
import { localSignup } from '@/lib/auth/localAuth';

function isLocalMode(): boolean {
  return process.env.AUTH_MODE !== 'cognito';
}

/** Ensure phone is in E.164 format (+91XXXXXXXXXX) */
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return `+${cleaned}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = signupSchema.parse(body);

    // Format phone for Cognito E.164 requirement
    const formattedPhone = formatPhone(validated.phone);

    if (isLocalMode()) {
      const result = localSignup(formattedPhone, validated.email, validated.name);
      return successResponse({
        userSub: result.userSub,
        message: 'Verification code sent',
      }, 201);
    }

    const result = await cognitoService.signup({
      ...validated,
      phone: formattedPhone,
    });
    return successResponse({
      userSub: result.userSub,
      message: 'Verification code sent',
    }, 201);
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
    if (cognitoError.name === 'UsernameExistsException') {
      return errorResponse('USER_EXISTS', 'An account with this phone number already exists', 409);
    }
    if (cognitoError.name === 'InvalidParameterException') {
      return errorResponse('INVALID_PARAM', cognitoError.message || 'Invalid parameters', 400);
    }
    if (cognitoError.name === 'InvalidPasswordException') {
      return errorResponse('INVALID_PASSWORD', 'Password does not meet requirements (min 8 chars, uppercase, lowercase, number, special char)', 400);
    }

    console.error('[auth/signup] Unexpected error:', error);
    return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500);
  }
}
