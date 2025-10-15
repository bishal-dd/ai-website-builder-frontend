import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ HF API Error:", errorText)
      return NextResponse.json({ error: "HF API request failed" }, { status: res.status })
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? "No content generated."

    return NextResponse.json({ content })
  } catch (err) {
    console.error("🔥 Server error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
