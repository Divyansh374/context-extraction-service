import normalResults from "../results/normal.results.json" with { type: "json" };
import boundaryInput from "../results/boundaryInput.results.json" with { type: "json" };
import emptyFields from "../results/emptyFields.results.json" with { type: "json" };
import invalidDataTypes from "../results/invalidDataTypes.results.json" with { type: "json" };
import missingFields from "../results/missingFields.results.json" with { type: "json" };
import special from "../results/special.results.json" with { type: "json" };
import unicode from "../results/unicode.results.json" with { type: "json" };
import veryLongInputs from "../results/veryLongInputs.results.json" with { type: "json" };
import veryShortInputs from "../results/veryShortInputs.results.json" with { type: "json" };
import whitespaces from "../results/whitespaces.results.json" with { type: "json" };
import allUnavailable from "../results/providerFallback/allUnavailable.results.json" with { type: "json" };
import onlyBraveAvailable from "../results/providerFallback/onlyBraveAvailable.results.json" with { type: "json" };
import onlySerperAvailable from "../results/providerFallback/onlySerperAvailable.results.json" with { type: "json" };
import onlyTavilyAvailable from "../results/providerFallback/onlyTavilyAvailable.results.json" with { type: "json" };
import tavilyUnavailable from "../results/providerFallback/tavilyUnavailable.results.json" with { type: "json" };
import { TestResult } from "../types/testResult.type.js";

interface AverageData {
    testResults: string[];
    allLatency: number[];
    normal: string[];
    providerFallback: string[];
    executed: string[];
    applicationFailure: number;
}

const calculateIndividualAverage = (result: TestResult[], averageData: AverageData) => {
    for (const item of result) {
        const category = item.id.split("-")[1];
        if (category === "NV") {
            if (item.passed) {
                averageData.normal.push("PASS");
            } else {
                averageData.normal.push("FAIL");
            }
        } else if (category === "PF") {
            if (item.passed) {
                averageData.providerFallback.push("PASS");
            } else {
                averageData.providerFallback.push("FAIL");
            }
        }

        if (item.passed) {
            averageData.testResults.push("PASS");
        } else {
            averageData.testResults.push("FAIL");
        }

        if (item.sources) {
            averageData.allLatency.push(item.latencyMs);
            if (item.actualStatus === 200) {
                if (item.passed) {
                    averageData.executed.push("PASS");
                } else {
                    averageData.executed.push("FAIL");
                }
            }
        }

        if (item.actualStatus === 200 && !item.sources) {
            averageData.applicationFailure++;
        }
    }
};

const calculateTotalAverage = () => {
    const results: TestResult[][] = [
        normalResults,
        boundaryInput,
        emptyFields,
        invalidDataTypes,
        missingFields,
        special,
        unicode,
        veryLongInputs,
        veryShortInputs,
        whitespaces,
        allUnavailable,
        onlyBraveAvailable,
        onlySerperAvailable,
        onlyTavilyAvailable,
        tavilyUnavailable,
    ];

    const averageData: AverageData = {
        testResults: [],
        allLatency: [],
        normal: [],
        providerFallback: [],
        executed: [],
        applicationFailure: 0,
    };

    for (const result of results) {
        calculateIndividualAverage(result, averageData);
    }

    const passed = averageData.testResults.filter((el) => el === "PASS").length;
    const rateLimitBlock: number =
        averageData.normal.filter((el) => el === "FAIL").length +
        averageData.providerFallback.filter((el) => el === "FAIL").length;
    const applicationFailure: number =
        averageData.testResults.filter((el) => el === "FAIL").length - rateLimitBlock;

    console.log(`
    Total Test Cases: 100
    End-to-end tests completed: ${averageData.executed.length} (These are the tests that actually got far enough to produce meaningful results)
    Total passed: ${passed} (Tests where the API behaved exactly as expected)
    Failed due to application behaviour: ${applicationFailure}
    Blocked by external LLM rate limit: ${rateLimitBlock}
    Provider Fallback Scenarios Tested: 5
        `);
};

calculateTotalAverage();
