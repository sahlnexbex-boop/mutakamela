/**
 * Typed frontend environment config.
 * Next.js only exposes variables prefixed with NEXT_PUBLIC_ to the browser.
 *
 * IMPORTANT: always read NEXT_PUBLIC_* with static property access
 * (`process.env.NEXT_PUBLIC_FOO`), never `process.env[name]`.
 * Next.js inlines public env vars at compile time only for static keys;
 * dynamic lookup is `undefined` in the browser and would always hit the fallback.
 *
 * Copy `.env.example` → `.env.local` and adjust values per environment.
 * Restart `next dev` after changing .env files.
 */

function optional(value: string | undefined, fallback: string): string {
  if (value === undefined || value === '') return fallback
  return value
}

export const env = {
  /** Base URL of the Fastify API (no trailing slash) */
  apiBaseUrl: optional(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    'http://localhost:4000',
  ).replace(/\/$/, ''),

  /** App environment label */
  appEnv: optional(process.env.NEXT_PUBLIC_APP_ENV, 'development'),

  /** localStorage key for the Passport bearer token */
  authTokenKey: optional(
    process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY,
    'mutakamela_cms_bearer_token',
  ),

  /** localStorage key for cached admin profile */
  authUserKey: optional(
    process.env.NEXT_PUBLIC_AUTH_USER_KEY,
    'mutakamela_cms_admin',
  ),

  /** localStorage key for admin light/dark/auto theme preference */
  adminThemeKey: optional(
    process.env.NEXT_PUBLIC_ADMIN_THEME_KEY,
    'mutakamela_cms_theme',
  ),
} as const

export type FrontendEnv = typeof env
