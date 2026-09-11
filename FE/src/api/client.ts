const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json') ? await response.json() : undefined;

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(body), response.status);
  }

  return body as T;
}

function extractErrorMessage(body: unknown): string {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    if (typeof record.errore === 'string') {
      return record.errore;
    }
    const fieldMessages = Object.entries(record)
      .filter(([, value]) => typeof value === 'string')
      .map(([field, value]) => `${field}: ${value as string}`);
    if (fieldMessages.length > 0) {
      return fieldMessages.join('; ');
    }
  }
  return 'Errore di comunicazione con il server';
}

export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, data: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(data) });

export const apiPatch = <T>(path: string, data: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(data) });

export const apiDelete = (path: string) => request<void>(path, { method: 'DELETE' });
