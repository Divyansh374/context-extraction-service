export interface TestCase {
    id: string;
    category: string;
    name: string;
    body: {
        topic: string;
        industry: string;
    };
    expectedStatus: number;
}
