const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function request(url: string, init?: RequestInit) {
    return fetch(`${baseUrl}${url}`, init)
}