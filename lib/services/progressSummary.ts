export async function getProgressSummary(trackId?: string | number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing");
  }

  let url = `${API_URL}/me/progress/summary`;
  if (trackId !== undefined) {
    url += `?trackId=${trackId}`;
  }

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch progress summary: ${res.status}`);
  }

  const json = await res.json();
  return json.data?.trackProgress || [];
}
