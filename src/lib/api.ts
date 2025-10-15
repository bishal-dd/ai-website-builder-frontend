export async function generateAIContent(prompt: string) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })

  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.content
}
