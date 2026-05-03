import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { size: string[] } }
) {
  const [width = "400", height = "300"] = params.size;
  const w = parseInt(width) || 400;
  const h = parseInt(height) || 300;

  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${w}" height="${h}" fill="#1e293b"/>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1b71f5;stop-opacity:0.3"/>
          <stop offset="100%" style="stop-color:#0d9488;stop-opacity:0.2"/>
        </linearGradient>
      </defs>
      <text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle" dy=".3em">${w} × ${h}</text>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
