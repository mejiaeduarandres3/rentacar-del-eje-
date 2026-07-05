export default async (request, context) => {
  const response = await context.next();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const geo = context.geo;
  const country = geo?.country?.name || geo?.country?.code || "Unknown";
  const city = geo?.city || "Unknown";
  const url = new URL(request.url);
  const page = url.pathname || "/";
  const referrer = request.headers.get("referer") || "direct";
  const userAgent = request.headers.get("user-agent") || "";
  const now = new Date().toISOString();

  const telegramToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!telegramToken || !telegramChatId) {
    return response;
  }

  const message = [
    `🌐 Nueva visita a rentacardeleje.com`,
    `📅 ${now}`,
    `📄 Página: ${page}`,
    `🌍 ${city}, ${country}`,
    `🔗 Referrer: ${referrer}`,
    `📱 ${userAgent.substring(0, 100)}`
  ].join("\n");

  const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

  try {
    await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "HTML",
        disable_notification: true
      })
    });
  } catch (_e) {
    // fire and forget
  }

  return response;
};

export const config = {
  path: "/*",
  excludedPath: ["/img/*", "/css/*", "/js/*", "/videos/*", "/*.xml", "/*.txt", "/*.ico"]
};
