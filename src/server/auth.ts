const SITE_PASSWORD = "09072004";
const COOKIE_NAME = "shiroo_auth";
// Random session token, unrelated to the password — even though it travels in a
// cookie, it never reveals the password and is HttpOnly so page JS can't read it.
const SESSION_TOKEN = "8f1c2e9a4b7d3f06c5a91e6b7d2f4a8c9e0b1d3f5a7c9e1b3d5f7a9c1e3b5d7f";

export function checkPassword(candidate: string): boolean {
  return candidate === SITE_PASSWORD;
}

export function isAuthCookieValid(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .some((c) => c === `${COOKIE_NAME}=${SESSION_TOKEN}`);
}

export function buildAuthCookie(): string {
  const maxAge = 60 * 60 * 24 * 180; // 180 days
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${SESSION_TOKEN}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}
