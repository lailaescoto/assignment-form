const BASE_URL = 'http://10.0.0.109:3000';

let token: string | null = null;
export const setToken = (t: string | null) => { 
  token = t; 
  console.log('Token set:', token);
};

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  console.log('Request:', path, { ...options, headers });

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  console.log('Response:', res.status, data);
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  health: () => request('/health'),
  signup: (body: { fullName: string; email: string; password: string }) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  signin: (body: { email: string; password: string }) =>
    request('/auth/signin', { method: 'POST', body: JSON.stringify(body) }),
  createEmployee: (body: {
    fullName: string; username: string; email: string; phone: string; department: string; address: string;
  }) => request('/employees', { method: 'POST', body: JSON.stringify(body) }),
  getEmployees: () => request('/employees'),
  getEmployee: (id: number) => request(`/employees/${id}`),
};

export default api;
