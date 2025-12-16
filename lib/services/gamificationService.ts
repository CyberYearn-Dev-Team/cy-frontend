import { apiClient } from '../api/client';

export async function getRewards(email: string) {
  return apiClient.get(`/me/gamification?email=${encodeURIComponent(email)}`)
    .then(res => res.data);
}

export async function getGamificationData() {
  return apiClient.get('/me/gamification')
    .then(res => res.data);
}

export async function getBadges() {
  return apiClient.get('/badges')
    .then(res => res.data);
}
