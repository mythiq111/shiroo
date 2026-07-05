import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { buildAuthCookie, checkPassword, isAuthCookieValid } from "./server/auth";
import { renderGatePage } from "./server/gatePage";

const authMiddleware = createMiddleware().server(async ({ request, next }) => {
  const url = new URL(request.url);

  if (url.pathname === "/__unlock" && request.method === "POST") {
    const form = await request.formData();
    const password = String(form.get("password") ?? "");
    if (checkPassword(password)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/", "Set-Cookie": buildAuthCookie() },
      });
    }
    return new Response(renderGatePage(true), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (isAuthCookieValid(request.headers.get("cookie"))) {
    return next();
  }

  return new Response(renderGatePage(false), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [authMiddleware, errorMiddleware],
}));
