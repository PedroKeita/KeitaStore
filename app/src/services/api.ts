export async function apiFetch(path: string, options?: RequestInit) {
  const BASE_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}