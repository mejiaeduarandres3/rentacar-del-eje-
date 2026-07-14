const BOT_PATTERNS = /bot|crawl|spider|slurp|googlebot|bingbot|yandex|baiduspider|duckduckbot|facebookexternalhit|facebot|ia_archiver|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|applebot|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|curl|wget|python|httpx|node-fetch|go-http|java\/|headlesschrome|phantomjs|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|statuscake|netcraft|zgrab|masscan|censys|shodan|scrapy|mechanize|libwww|lwp|httpclient|apache-http|okhttp|axios|postman|insomnia|nmap|nikto|sqlmap|dirbuster|gobuster|nuclei|wpscan|acunetix|nessus|qualys|zap|burp/i;

const SUSPICIOUS_PATHS = /\.(json|env|xml|yml|yaml|ini|conf|cfg|bak|sql|log|git|svn|htaccess|htpasswd|DS_Store|php|asp|aspx|jsp|cgi)$|\/\.|wp-|wordpress|admin|login|phpmyadmin|xmlrpc|eval-stdin|vendor\/|node_modules|\.well-known\/|ckeditor|fckeditor|elfinder|config|backup|database|dump/i;

function isBot(userAgent) {
  if (!userAgent || userAgent.length < 20) return true;
  return BOT_PATTERNS.test(userAgent);
}

function isSuspiciousPath(path) {
  return SUSPICIOUS_PATHS.test(path);
}

function getDeviceType(ua) {
  if (/mobile|android.*mobile|iphone|ipod/i.test(ua)) return "Mobile";
  if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) return "Tablet";
  return "Desktop";
}

function getSource(referrer) {
  if (!referrer || referrer === "direct") return "Directo";
  try {
    const host = new URL(referrer).hostname;
    if (/google\./i.test(host)) return "Google";
    if (/bing\./i.test(host)) return "Bing";
    if (/facebook\.com|fb\.com/i.test(host)) return "Facebook";
    if (/instagram\.com/i.test(host)) return "Instagram";
    if (/tiktok\.com/i.test(host)) return "TikTok";
    if (/tripadvisor/i.test(host)) return "TripAdvisor";
    if (/booking\.com/i.test(host)) return "Booking";
    if (/whatsapp/i.test(host)) return "WhatsApp";
    return host;
  } catch {
    return referrer.substring(0, 30);
  }
}

const PAGE_NAMES = {
  "/": "Inicio",
  "/index.html": "Inicio",
  "/fortuner-2023": "Fortuner 2023",
  "/hilux": "Hilux",
  "/kia-picanto": "Kia Picanto",
  "/kia-seltos": "Kia Seltos",
  "/mazda-cx30": "Mazda CX-30",
  "/todos": "Flota completa",
  "/nosotros": "Nosotros",
  "/renta-carros-pereira": "Pereira",
  "/renta-carros-armenia": "Armenia",
  "/renta-carros-manizales": "Manizales",
  "/salento-valle-de-cocora": "Salento y Cocora",
  "/nevado-del-ruiz-termales": "Nevado y Termales",
  "/ruta-eje-cafetero": "Ruta Eje Cafetero",
  "/en": "EN Home",
  "/en/": "EN Home",
  "/en/index.html": "EN Home",
  "/en/fleet": "EN Fleet",
  "/en/toyota-fortuner-2023": "EN Fortuner",
  "/en/toyota-hilux": "EN Hilux",
  "/en/mazda-cx30": "EN CX-30",
  "/en/kia-seltos": "EN Seltos",
  "/en/kia-picanto": "EN Picanto",
  "/en/about": "EN About",
  "/en/car-rental-pereira": "EN Pereira",
  "/en/car-rental-armenia": "EN Armenia",
  "/en/car-rental-manizales": "EN Manizales",
  "/en/salento-cocora-valley": "EN Salento",
  "/en/nevado-del-ruiz": "EN Nevado",
  "/en/coffee-region-road-trip": "EN Road Trip",
};

const recentVisits = new Map();
const DEDUP_WINDOW_MS = 10000;

function isDuplicate(key) {
  const now = Date.now();
  const last = recentVisits.get(key);
  if (last && now - last < DEDUP_WINDOW_MS) return true;
  recentVisits.set(key, now);
  if (recentVisits.size > 500) {
    const cutoff = now - DEDUP_WINDOW_MS;
    for (const [k, v] of recentVisits) {
      if (v < cutoff) recentVisits.delete(k);
    }
  }
  return false;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.rentacardeleje.com") {
    url.hostname = "rentacardeleje.com";
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const request = context.request;
  const userAgent = request.headers.get("user-agent") || "";

  if (isBot(userAgent)) {
    return response;
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\.html$/, "") || "/";

  if (isSuspiciousPath(url.pathname)) {
    return response;
  }

  const pageName = PAGE_NAMES[path];
  if (!pageName) {
    return response;
  }

  const cf = request.cf || {};
  const country = cf.country || "??";
  const city = cf.city || "Unknown";
  const region = cf.region || "";
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const referrer = request.headers.get("referer") || "direct";

  const dedupKey = `${ip}:${path}`;
  if (isDuplicate(dedupKey)) {
    return response;
  }

  const location = region ? `${city}, ${region}` : city;
  const device = getDeviceType(userAgent);
  const source = getSource(referrer);

  const telegramToken = context.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = context.env.TELEGRAM_CHAT_ID;

  if (telegramToken && telegramChatId) {
    const flag = country === "CO" ? "\u{1F1E8}\u{1F1F4}" :
                 country === "US" ? "\u{1F1FA}\u{1F1F8}" :
                 country === "CA" ? "\u{1F1E8}\u{1F1E6}" :
                 country === "ES" ? "\u{1F1EA}\u{1F1F8}" :
                 country === "MX" ? "\u{1F1F2}\u{1F1FD}" :
                 country === "AR" ? "\u{1F1E6}\u{1F1F7}" :
                 country === "CL" ? "\u{1F1E8}\u{1F1F1}" :
                 country === "EC" ? "\u{1F1EA}\u{1F1E8}" :
                 country === "PE" ? "\u{1F1F5}\u{1F1EA}" :
                 country === "BR" ? "\u{1F1E7}\u{1F1F7}" :
                 country === "GB" ? "\u{1F1EC}\u{1F1E7}" :
                 country === "DE" ? "\u{1F1E9}\u{1F1EA}" :
                 country === "FR" ? "\u{1F1EB}\u{1F1F7}" :
                 country === "NL" ? "\u{1F1F3}\u{1F1F1}" :
                 country === "IT" ? "\u{1F1EE}\u{1F1F9}" :
                 country === "AU" ? "\u{1F1E6}\u{1F1FA}" :
                 country === "PA" ? "\u{1F1F5}\u{1F1E6}" :
                 country === "IN" ? "\u{1F1EE}\u{1F1F3}" :
                 "\u{1F30D}";

    const message = [
      `${flag} ${location}, ${country}`,
      `\u{1F4C4} ${pageName}`,
      `\u{1F4F1} ${device} \u{2022} via ${source}`,
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
            disable_notification: true
          })
        })
      );
    } catch (e) {}
  }

  return response;
}
