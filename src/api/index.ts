import type { Reservation, ReservationTime, Theme } from '../types';

const BASE = 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text);
}

export const api = {
  themes: {
    list: () => request<Theme[]>('/themes'),
    get: (id: number) => request<Theme>(`/themes/${id}`),
    famous: (params?: { days?: number; limit?: number; date?: string }) => {
      const q = new URLSearchParams();
      if (params?.days) q.set('days', String(params.days));
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.date) q.set('date', params.date);
      return request<Theme[]>(`/themes/famous?${q}`);
    },
    create: (body: Omit<Theme, 'id'>) =>
      request<Theme>('/admin/themes', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: Omit<Theme, 'id'>) =>
      request<Theme>(`/admin/themes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: number) => request<void>(`/admin/themes/${id}`, { method: 'DELETE' }),
  },

  times: {
    list: () => request<ReservationTime[]>('/times'),
    available: (date: string, themeId: number) =>
      request<ReservationTime[]>(`/times/available?date=${date}&themeId=${themeId}`),
    create: (startAt: string) =>
      request<ReservationTime>('/admin/times', { method: 'POST', body: JSON.stringify({ startAt }) }),
    delete: (id: number) => request<void>(`/admin/times/${id}`, { method: 'DELETE' }),
  },

  reservations: {
    list: () => request<Reservation[]>('/reservations'),
    get: (id: number) => request<Reservation>(`/reservations/${id}`),
    create: (body: { name: string; themeId: number; date: string; timeId: number }) =>
      request<Reservation>('/reservations', { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: number) => request<void>(`/admin/reservations/${id}`, { method: 'DELETE' }),
  },
};
