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


// TOGGLE VISIBILITY ON AND OFF 
export interface MetricVisibility {
  key: string;
  visible: boolean;
}

// GET all visibilities
export async function fetchMetricsVisibility(): Promise<MetricVisibility[]> {
  const response = await apiClient.get("/admin/metrics/visibility");
  return response.data.data;
}

// POST update visibility
export async function updateMetricVisibility(
  key: string,
  visible: boolean
): Promise<void> {
  await apiClient.post("/admin/metrics", {
    key,
    visible,
  });
}