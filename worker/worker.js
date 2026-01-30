const ALLOWED_ORIGINS = [
  "https://adamfreisinger.me",
  "http://localhost:8080",
  "http://localhost:8081",
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, request, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request) },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/likes\/(.+)$/);
    if (!match) {
      return json({ error: "Not found" }, request, 404);
    }

    const slug = decodeURIComponent(match[1]);

    if (request.method === "GET") {
      const likes = parseInt((await env.LIKES.get(slug)) || "0", 10);
      return json({ slug, likes }, request);
    }

    if (request.method === "POST") {
      const current = parseInt((await env.LIKES.get(slug)) || "0", 10);
      const next = current + 1;
      await env.LIKES.put(slug, next.toString());
      return json({ slug, likes: next }, request);
    }

    return json({ error: "Method not allowed" }, request, 405);
  },
};
