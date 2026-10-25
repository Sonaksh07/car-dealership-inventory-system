const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function getStoredToken() {
  return localStorage.getItem('dealership_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('dealership_token', token);
  } else {
    localStorage.removeItem('dealership_token');
  }
}

export function getStoredUser() {
  const user = localStorage.getItem('dealership_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('dealership_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('dealership_user');
  }
}

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      setStoredToken(null);
      setStoredUser(null);
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const message = data.detail || (Array.isArray(data) ? data[0]?.msg : 'An unexpected error occurred');
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // Vehicles
  getVehicles: () => request('/vehicles'),
  searchVehicles: (params) => {
    const query = new URLSearchParams();
    if (params.make) query.append('make', params.make);
    if (params.model) query.append('model', params.model);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.min_price) query.append('min_price', params.min_price);
    if (params.max_price) query.append('max_price', params.max_price);
    const qs = query.toString();
    return request(`/vehicles/search${qs ? `?${qs}` : ''}`);
  },
  addVehicle: (payload) => request('/vehicles', { method: 'POST', body: JSON.stringify(payload) }),
  updateVehicle: (id, payload) => request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),
  purchaseVehicle: (id) => request(`/vehicles/${id}/purchase`, { method: 'POST' }),
  restockVehicle: (id, quantity) => request(`/vehicles/${id}/restock`, { method: 'POST', body: JSON.stringify({ quantity: Number(quantity) }) }),
};
