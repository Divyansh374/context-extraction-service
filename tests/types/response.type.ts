export interface APIResponse {
    status: number;
    statusText: string;
    ok: boolean;
    headers: object;
    url: string;
    body: object;
    bodyUsed: boolean;
}
