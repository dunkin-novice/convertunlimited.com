export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    const hostname = new URL(request.url).hostname;
    const isWorkersDev = hostname.endsWith(".workers.dev");

    if (isWorkersDev) {
      headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }

    const contentType = headers.get("content-type") || "";
    if (isWorkersDev && contentType.includes("text/html")) {
      const html = await response.text();
      const robots = '<meta name="robots" content="noindex,nofollow,noarchive">';
      const body = /<meta\s+name=["']robots["'][^>]*>/i.test(html)
        ? html.replace(/<meta\s+name=["']robots["'][^>]*>/i, robots)
        : html.replace(/<head[^>]*>/i, (match) => `${match}\n    ${robots}`);

      headers.delete("content-length");
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
