export const callExtractAPI = async (body: object) => {
    const start = performance.now();

    const response = await fetch("http://localhost:3000/api/v1/extract/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const latencyMs = performance.now() - start;

    let data;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    return {
        status: response.status,
        latencyMs,
        data,
    };
};
