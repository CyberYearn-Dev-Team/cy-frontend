import { apiClient } from '../api/client';

export interface RegistrationsTrend {
  date: string;
  count: number;
}

export interface WauMauData {
  week: string;
  wau: number;
  mau: number;
  ratio: number;
}

export interface SevenDayActivation {
  day: string;
  rate: number;
}

export interface MetricsData {
  registrationsTrend: RegistrationsTrend[];
  wauMauRatio: WauMauData[];
  moduleCompletionRate: number;
  sevenDayActivation: SevenDayActivation[];
  medianTimeToFirstContent: number;
}

export async function fetchMetrics(): Promise<MetricsData> {
  const response = await apiClient.get<MetricsData>('/admin/metrics');
  return response.data;
}
