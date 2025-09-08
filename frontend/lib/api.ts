const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export async function apiFetch<T>(path: string, options: { method?: HttpMethod; body?: unknown; headers?: Record<string, string> } = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  // debugger;
  console.log(headers, API_BASE_URL, process.env.NEXT_PUBLIC_API_BASE_URL);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json() : (await res.text()) as unknown as T

  if (!res.ok) {
    const message = isJson && (data as any)?.message ? (data as any).message : res.statusText
    throw new Error(message)
  }
  return data as T
}


