import jwt from 'jsonwebtoken';

const PLATFORM_JWT_SECRET = process.env.PLATFORM_JWT_SECRET!;

export interface AppTokenPayload {
    /** User ID */
    sub: string;
    /** User email */
    email: string;
    /** User role on the platform */
    role: string;
    /** App ID this token is scoped to */
    appId: string;
    /** App slug */
    appSlug: string;
    iat?: number;
    exp?: number;
}

/**
 * Verify an app-scoped JWT issued by the Inverted platform.
 * These tokens are signed with PLATFORM_JWT_SECRET and contain
 * the user's identity + the app scope.
 */
export function verifyAppToken(token: string): AppTokenPayload {
    return jwt.verify(token, PLATFORM_JWT_SECRET) as AppTokenPayload;
}

/**
 * Express middleware that extracts and verifies the app-scoped JWT.
 * Sets `req.user` with the decoded payload if valid.
 */
export function authMiddleware(
    req: any,
    _res: any,
    next: () => void,
) {
    const authHeader = req.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
            req.user = verifyAppToken(token);
        } catch {
            // Invalid/expired token — continue unauthenticated
        }
    }
    next();
}
