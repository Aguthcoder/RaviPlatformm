export type ApiEvent = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  startDate: string;
  capacity: number;
  reservedCount: number;
  price: number;
};

export type NotificationItem = {
  id: string;
  type: 'match' | 'message' | 'event';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type UserProfile = {
  avatarUrl: string | null;
  bio: string | null;
  interests: string[];
  city: string | null;
  age: number | null;
  gender: string | null;
  education: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function apiRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest<T>(path, init, false);
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const data = await apiRequest<{ accessToken: string; user: { email: string; subscriptionPlan: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setAccessToken(data.accessToken);
  return data;
}

export async function refreshAccessToken() {
  try {
    const data = await apiRequest<{ accessToken: string }>('/auth/refresh', { method: 'POST' }, false);
    setAccessToken(data.accessToken);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}

export async function fetchEvents(params?: { category?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.limit) query.set('limit', String(params.limit));

  const suffix = query.toString() ? `?${query.toString()}` : '';
  const data = await apiRequest<{ count: number; events: ApiEvent[] }>(`/events${suffix}`);
  return data.events;
}

export async function reserveEvent(eventId: string, seats = 1) {
  return apiRequest('/events/reserve', {
    method: 'POST',
    body: JSON.stringify({ eventId, seats }),
  });
}

export async function fetchNotifications() {
  return apiRequest<{ unread: number; items: NotificationItem[] }>('/notifications');
}

export async function fetchSubscription() {
  return apiRequest<{ plan: string; features: string[] }>('/subscriptions/me');
}

export async function subscribe(provider: 'zarinpal' | 'stripe') {
  return apiRequest<{ status: string; redirectUrl: string }>('/payments/subscribe', {
    method: 'POST',
    body: JSON.stringify({ provider }),
  });
}

export async function fetchUserProfile() {
  return apiRequest<UserProfile>('/user/profile');
}

export async function updateUserProfile(payload: Partial<UserProfile>) {
  return apiRequest<UserProfile & { usage: string; id: string }>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
