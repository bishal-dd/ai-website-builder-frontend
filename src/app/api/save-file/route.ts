import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { wrapForIframe } from "@/lib/wrapForIframe"

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 })
    }

    // ✅ Wrap HTML with Tailwind support
    const fullHtml = wrapForIframe(content)

    // Save to `/public`
    const publicDir = path.join(process.cwd(), "public")
    const fileName = `ai-generated-${Date.now()}.html`
    const filePath = path.join(publicDir, fileName)

    await mkdir(publicDir, { recursive: true })
    await writeFile(filePath, fullHtml, "utf8")

    // Return the URL path for the browser
    return NextResponse.json({ url: `/${fileName}` })
  } catch (error) {
    console.error("❌ Error saving file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
