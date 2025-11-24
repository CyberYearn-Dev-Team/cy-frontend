export async function getRewards() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/gamification`, {
    credentials: "include"
  }).then(res => res.json());
}
