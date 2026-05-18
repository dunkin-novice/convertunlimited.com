export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    const hostname = new URL(request.url).hostname;

    if (hostname.endsWith(".workers.dev")) {
      headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
