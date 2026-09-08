// api/exam.js
// Vercel Edge Function — injects GEMINI_API_KEY into the HTML template
// Place this file at:  /api/exam.js  in your Vercel project root

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const base = url.origin;

  // Fetch the template HTML (served as a static file from /public/)
  const templateRes = await fetch(base + '/descriptive-exam-template.html');
  if (!templateRes.ok) {
    return new Response('Template not found. Make sure descriptive-exam-template.html is in /public/', { status: 404 });
  }

  const template = await templateRes.text();
  const apiKey = process.env.GEMINI_API_KEY || '';

  // Replace the placeholder with the real key
  const html = template.replace(
    `const GEMINI_API_KEY = (typeof __GEMINI_KEY__ !== 'undefined' ? __GEMINI_KEY__ : '') || '';`,
    `const GEMINI_API_KEY = '${apiKey}';`
  );

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
