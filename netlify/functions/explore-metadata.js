const decodeHtmlEntities = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const extractAttribute = (tag, attribute) => {
  const match = tag.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match ? decodeHtmlEntities(match[1].trim()) : '';
};

const resolveUrl = (value, baseUrl) => {
  if (!value) return undefined;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
};

const extractMetaContent = (html, key) => {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const target = key.toLowerCase();

  for (const tag of tags) {
    const property = extractAttribute(tag, 'property').toLowerCase();
    const name = extractAttribute(tag, 'name').toLowerCase();
    if (property === target || name === target) {
      const content = extractAttribute(tag, 'content');
      if (content) return content;
    }
  }

  return undefined;
};

const extractLinkHref = (html, relNames) => {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const targets = relNames.map((rel) => rel.toLowerCase());

  for (const tag of tags) {
    const rel = extractAttribute(tag, 'rel').toLowerCase();
    if (targets.some((target) => rel.split(/\s+/).includes(target) || rel.includes(target))) {
      const href = extractAttribute(tag, 'href');
      if (href) return href;
    }
  }

  return undefined;
};

const extractTitle = (html) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtmlEntities(match[1].replace(/\s+/g, ' ').trim()) : undefined;
};

exports.handler = async (event) => {
  const inputUrl = event.queryStringParameters?.url || '';

  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported URL protocol');
    }
  } catch {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'A valid http or https URL is required' }),
    };
  }

  const fallback = {
    title: parsedUrl.hostname.replace(/^www\./, ''),
    faviconUrl: `${parsedUrl.origin}/favicon.ico`,
    domain: parsedUrl.hostname.replace(/^www\./, ''),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'user-agent': 'VebpartnerMetadataBot/1.0 (+https://vebpartner.com)',
        accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Metadata request failed with ${response.status}`);
    }

    const html = (await response.text()).slice(0, 250000);
    const favicon = extractLinkHref(html, ['apple-touch-icon', 'shortcut icon', 'icon']) || '/favicon.ico';
    const imageUrl = extractMetaContent(html, 'og:image');

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=86400',
      },
      body: JSON.stringify({
        title: extractMetaContent(html, 'og:title') || extractTitle(html) || fallback.title,
        description: extractMetaContent(html, 'description') || extractMetaContent(html, 'og:description'),
        faviconUrl: resolveUrl(favicon, parsedUrl.toString()) || fallback.faviconUrl,
        imageUrl: resolveUrl(imageUrl, parsedUrl.toString()),
        domain: fallback.domain,
      }),
    };
  } catch {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=3600',
      },
      body: JSON.stringify(fallback),
    };
  }
};
