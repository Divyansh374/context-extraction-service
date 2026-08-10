import { mkdir, access, writeFile } from "node:fs/promises";
import { callExtractAPI } from "../utils/apiClient.js";
import { validate } from "../utils/validator.js";
import { specialRequests } from "../requests/special.requests.js";
import { TestResult } from "../types/testResult.type.js";
import path from "node:path";

const runProviderFallback = async () => {
    const resultsDir = path.join(process.cwd(), "tests", "results");
    await mkdir(resultsDir, { recursive: true });

    const resultsPath = path.join(resultsDir, "special.results.json");

    await access(resultsPath);

    const resultContent: TestResult[] = [];
    for (const testCase of specialRequests) {
        console.log(`Running ${testCase.id}`);

        const { status, latencyMs, data } = await callExtractAPI(testCase.body);

        const { passed, errors } = validate(status, data, testCase, testCase.category);

        if (passed) {
            console.log(`-> ✅ PASS`);
        } else {
            console.log(`-> ❌ FAIL`);
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
        await writeFile(resultsPath, JSON.stringify(resultContent, null, 2));
    }
};

runProviderFallback();
