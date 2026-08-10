import { writeFile } from "node:fs/promises";
import { normalRequests } from "../requests/normal.requests.js";
import { callExtractAPI } from "../utils/apiClient.js";
import { validate } from "../utils/validator.js";
import { TestResult } from "../types/testResult.type.js";

const runNormal = async () => {
    const resultContent: TestResult[] = [];
    for (const testCase of normalRequests) {
        console.log(`Running ${testCase.id}`);

        const { status, latencyMs, data } = await callExtractAPI(testCase.body);

        const { passed, errors } = validate(status, data, testCase);

        if (passed) {
            console.log(`${testCase.id} - ✅ PASS`);
        } else {
            console.log(`${testCase.id} - ❌ FAIL`);
        }

        resultContent.push({
            id: testCase.id,
            name: testCase.name,
            expectedStatus: testCase.expectedStatus,
            actualStatus: status,
            latencyMs,
            passed,
            sources: data?.sources,
            errorLog: errors,
        });
    }

    await writeFile("../results/normal.results.json", JSON.stringify(resultContent, null, 2));
};

runNormal();
