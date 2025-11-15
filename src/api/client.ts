import { API_BASE_URL } from "../config";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    let errorData = null;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "Unknown error occurred" };
    }

    throw {
      status: response.status,
      data: errorData,
    };
  }

  return response.json();
};

export const graphqlFetch = async <T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/graphql/api/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    console.error("GraphQL Error:", result.errors);
    throw new Error(result.errors?.[0]?.message || "GraphQL request failed");
  }

  return result.data;
};
