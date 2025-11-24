export async function startLesson(lessonId: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/progress`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lessonId,
      status: "IN_PROGRESS",
      timeSpentDelta: 0
    })
  }).then(res => res.json());
}

export async function trackTime(lessonId: string, delta: number) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/progress`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lessonId,
      status: "IN_PROGRESS",
      timeSpentDelta: delta
    })
  }).then(res => res.json());
}

export async function completeLesson(lessonId: string, timeSpent: number) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/progress`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lessonId,
      status: "COMPLETED",
      timeSpentDelta: timeSpent
    })
  }).then(res => res.json());
}
