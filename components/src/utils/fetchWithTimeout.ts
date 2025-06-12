// src/utils/fetchWithTimeout.ts
export async function fetchWithTimeout(
    input: RequestInfo,
    init: RequestInit = {},
    timeout = 5000
) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(input, {
            ...init,
            signal: controller.signal,
            credentials: 'include',
        });
        return res;
    } finally {
        clearTimeout(id);
    }
}
