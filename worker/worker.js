const ALLOWED_ORIGIN = "https://adamfreisinger.me";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const match = url.pathname.match(/^\/likes\/(.+)$/);
    if (!match) {
      return json({ error: "Not found" }, 404);
    }

    const slug = decodeURIComponent(match[1]);

    if (request.method === "GET") {
      const likes = parseInt((await env.LIKES.get(slug)) || "0", 10);
      return json({ slug, likes });
    }

    if (request.method === "POST") {
      const current = parseInt((await env.LIKES.get(slug)) || "0", 10);
      const next = current + 1;
      await env.LIKES.put(slug, next.toString());
      return json({ slug, likes: next });
    }

    return json({ error: "Method not allowed" }, 405);
  },
};
