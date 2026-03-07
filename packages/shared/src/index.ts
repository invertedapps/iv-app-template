/**
 * App-specific shared types.
 *
 * Define types, constants, and utilities shared between
 * the frontend (desktop) and backend (API) here.
 */

/** Example shared type */
export interface AppConfig {
    name: string;
    slug: string;
    version: string;
}

/** Common API response wrapper */
export interface ApiResponse<T> {
    data: T;
    error?: string;
}
