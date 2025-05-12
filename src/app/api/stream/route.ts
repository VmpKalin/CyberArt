import { NextRequest } from "next/server";
import { readFileSync, existsSync, createReadStream } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");

  if (!path) {
    return new Response("Missing path", { status: 400 });
  }

  const filePath = join("/usr/local/nginx/html/stream", path);

  if (!existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const isTs = path.endsWith(".ts");
  const isM3U8 = path.endsWith(".m3u8");

  if (isM3U8) {
    // Прочитати і замінити шляхи
    const content = readFileSync(filePath, "utf-8");
    const rewritten = content.replace(
      /^(index\d+\.ts)$/gm,
      (_, segment) => `/api/stream?path=${segment}`
    );

    return new Response(rewritten, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  }

  const stream = createReadStream(filePath);
  return new Response(stream as any, {
    status: 200,
    headers: {
      "Content-Type": isTs
        ? "video/mp2t"
        : "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache",
    },
  });
}
