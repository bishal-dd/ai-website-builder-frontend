import { getUserCountry } from "@/features/preview/domain/api/geo";

export async function updateUserCountry() {
  const countryCode = await getUserCountry();

  if (!countryCode) {
    return;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/country`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        countryCode,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update user country");
  }

  return response.json();
}
