const ACCESS_TOKEN_KEY = 'gcs-access-token';

const getToken = () => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || '';
};

const apiCall = async (path, { method = 'POST' } = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('Please sign in first.');
  }

  const response = await fetch(path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    const message = data?.error || data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
};

export const blockUser = (userId) => apiCall(`/backend/social/users/${userId}/block/`, { method: 'POST' });
export const unblockUser = (userId) => apiCall(`/backend/social/users/${userId}/unblock/`, { method: 'DELETE' });
