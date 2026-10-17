export const token_response = {
  access_token: "token",
  token_type: "Bearer",
  expires_in: 3600,
};

type Handler = (url: string, init: RequestInit | undefined) => Response | Promise<Response>;

/**
 * Wraps a route handler into a fetch replacement, transparently answering
 * the oauth handshake so the client never touches the network.
 */
export function mockApi(handler: Handler): typeof fetch {
  const fn = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

    if (url.includes("/oauth/token")) {
      return Response.json(token_response);
    }

    return handler(url, init);
  };

  return fn as unknown as typeof fetch;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
