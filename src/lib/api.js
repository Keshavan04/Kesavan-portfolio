/** Thin client for server/index.js. Token lives in sessionStorage. */
const KEY = 'admin-token'

export const getToken = () => {
  try {
    return sessionStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}
export const setToken = (t) => {
  try {
    t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY)
  } catch {
    /* private mode */
  }
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { method, headers, body: form || (body && JSON.stringify(body)) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`)
  return data
}

export const api = {
  login: (username, password) => request('/api/login', { method: 'POST', body: { username, password } }),
  session: () => request('/api/session'),
  projects: () => request('/api/projects'),
  saveProjects: (list) => request('/api/projects', { method: 'PUT', body: list }),
  upload: (file) => {
    const form = new FormData()
    form.append('image', file)
    return request('/api/upload', { method: 'POST', form })
  },
}
