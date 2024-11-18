const BASE_URL = "http://localhost:8080";

const apiRequest = async (endpoint, options, method) => {
  options.method = method;
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return await response.json();
};

export const get = (endpoint, options) => apiRequest(endpoint, options, "GET");

export const post = (endpoint, options) =>
  apiRequest(endpoint, options, "POST");
