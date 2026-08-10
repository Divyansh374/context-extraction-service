export interface TestResult {
    id: string;
    name: string;
    expectedStatus: number | null;
    actualStatus: number | null;
    latencyMs: number;
    passed: boolean;
    sources?: {
        reddit?: "success" | "failed";
        linkedIn?: "success" | "failed";
        instagram?: "success" | "failed";
    };
    errorLog: string[];
}
