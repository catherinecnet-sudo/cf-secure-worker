export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const email =
      request.headers.get("Cf-Access-Authenticated-User-Email") || "unknown-user";

    const country = request.cf?.country || "XX";
    const timestamp = new Date().toISOString();

    if (path === "/secure" || path === "/secure/") {
      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Secure Identity</title>
  </head>
  <body>
    <p>${escapeHtml(email)} authenticated at ${escapeHtml(timestamp)} from <a href="/secure/${encodeURIComponent(country)}">${escapeHtml(country)}</a></p>
  </body>
</html>`;

      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    if (path.startsWith("/secure/")) {
      const code = decodeURIComponent(path.replace("/secure/", "")).toUpperCase();

      if (!/^[A-Z]{2}$/.test(code)) {
        return new Response("Invalid country code", { status: 400 });
      }

      let object = await env.FLAGS_BUCKET.get(`${code}.png`);
      let contentType = "image/png";

      if (!object) {
        object = await env.FLAGS_BUCKET.get(`${code}.svg`);
        contentType = "image/svg+xml";
      }

      if (!object) {
        return new Response("Flag not found", { status: 404 });
      }

      return new Response(object.body, {
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=3600"
        }
      });
    }

    return new Response("Not found", { status: 404 });
  }
};

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}