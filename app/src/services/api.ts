const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(options.headers as Record<string, string> || {}),
}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

 
  if (!response.ok) {
    let errorMessage = 'Erro na requisição'

    try {
      const data = await response.json()
      errorMessage = data.error || errorMessage
    } catch {}

    throw new Error(errorMessage)
  }

  return response.json()
}