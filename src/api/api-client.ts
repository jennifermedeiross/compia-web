const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("Erro na API");
  }

  return res.json();
}
