export async function onRequest(context) {
  const response = await context.next();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const request = context.request;
  const cf = request.cf || {};
  const country = cf.country || "??";
  const city = cf.city || "Unknown";
  const region = cf.region || "";
  const url = new URL(request.url);
  const page = url.pathname || "/";
  const referrer = request.headers.get("referer") || "direct";
  const userAgent = request.headers.get("user-agent") || "";
  const now = new Date().toISOString();

  const telegramToken = context.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = context.env.TELEGRAM_CHAT_ID;

  if (telegramToken && telegramChatId) {
    const location = region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;

    const message = [
      `\u{1F310} Nueva visita a rentacardeleje.com`,
      `\u{1F4C5} ${now}`,
      `\u{1F4C4} Página: ${page}`,
      `\u{1F30D} ${location}`,
      `\u{1F517} Referrer: ${referrer}`,
      `\u{1F4F1} ${userAgent.substring(0, 100)}`
    ].join("\n");

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    try {
      context.waitUntil(
        fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: Number(telegramChatId),
            text: message,
            disable_notification: false
          })
        })
      );
    } catch (e) {}
  }

  return response;
}
