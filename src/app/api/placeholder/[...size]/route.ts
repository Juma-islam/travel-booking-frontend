import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ size: string[] }> }
) {
  const { size } = await params;
  const [width = "400", height = "300"] = size ?? [];
  const w = parseInt(width) || 400;
  const h = parseInt(height) || 300;

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="#1e293b"/>
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.2"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle" dy=".3em">${w} × ${h}</text>
  </svg>`.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
