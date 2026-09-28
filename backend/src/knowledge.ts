import sanitizeHtml from 'sanitize-html';

export function chunkText(input: string, size = 900, overlap = 120) {
  const text = input.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
  if (!text) return [];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(text.length, start + size);
    if (end < text.length) {
      const breakAt = Math.max(text.lastIndexOf('\n', end), text.lastIndexOf('. ', end));
      if (breakAt > start + size * 0.55) end = breakAt + 1;
    }
    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= text.length) break;
    start = Math.max(start + 1, end - overlap);
  }
  return chunks;
}

export function htmlToText(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}

export async function fetchPublicPage(url: string) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http and https URLs are supported');
  const host = parsed.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.local') || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host)) throw new Error('Private network URLs are not allowed');
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(parsed, { signal: controller.signal, redirect: 'follow', headers: { 'User-Agent': 'ChatbotKnowledgeBot/1.0' } });
    if (!response.ok) throw new Error(`Website returned ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html') && !type.includes('text/plain')) throw new Error('URL must return HTML or plain text');
    const body = await response.text();
    return htmlToText(body).slice(0, 500_000);
  } finally { clearTimeout(timeout); }
}
