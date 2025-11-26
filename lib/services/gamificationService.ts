export async function getRewards(email: string) {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/me/gamification?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "include",
    }
  ).then(res => res.json());
}
