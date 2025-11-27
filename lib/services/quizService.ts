export async function getQuiz(lessonId: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/quiz`, {
    credentials: "include"
  }).then(res => res.json());
}

export async function submitQuiz(quizId: string, score: number, passed: boolean) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/submit`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, passed })
  }).then(res => res.json());
}
