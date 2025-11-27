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

export async function completeLesson(lessonId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/progress`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lessonId,
        status: "COMPLETED",
        timeSpentDelta: 300
      })
    });

    console.log("Request sent to backend:", lessonId);

    if (!res.ok) {
      console.error("Backend error:", await res.text());
      throw new Error("Failed to update lesson progress");
    }

    const data = await res.json();
    console.log("Backend responded 200:", data);
    return data;
  } catch (error) {
    console.error("FETCH ERROR:", error);
    throw error;
  }
}
