export async function getAIResponse(prompt: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Backend API Error:", errorText);
    throw new Error("Failed to fetch AI response");
  }

  const data = await response.json();
  return data.content;
}
