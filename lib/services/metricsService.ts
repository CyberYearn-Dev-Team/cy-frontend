const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cy-backend.onrender.com/api/v1';

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
  const response = await fetch(`${API_BASE_URL}/admin/metrics`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch metrics data');
  }

  return response.json();
}
