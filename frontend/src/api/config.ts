import type { ApiErrorResponse } from '../types/order';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

export function shouldUseMockApi(): boolean {
  return USE_MOCK_API || !API_BASE_URL;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function parseError(response: Response): Promise<ApiErrorResponse> {
  try {
    const error = (await response.json()) as ApiErrorResponse;
    const details = error.details
      ? Object.entries(error.details)
          .map(
            ([field, message]) =>
              `${field}: ${Array.isArray(message) ? message.join(', ') : message}`,
          )
          .join('; ')
      : '';

    return {
      ...error,
      message: details ? `${error.message} (${details})` : error.message,
    };
  } catch {
    return {
      code: 'HTTP_ERROR',
      message: `Request failed with status ${response.status}`,
    };
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const error = await parseError(response);
    throw new Error(error.message);
  }

  return (await response.json()) as T;
}
