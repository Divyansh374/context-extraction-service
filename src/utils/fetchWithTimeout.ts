export const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeout = 10_000,
) => {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timeoutId);
    }
};
