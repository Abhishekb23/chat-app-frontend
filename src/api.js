const API_URL = "https://chat-app-backend-tjcb.onrender.com";

export const api = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export default API_URL;