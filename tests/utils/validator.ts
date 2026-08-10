import { Result } from "../types/result.type.js";
import { TestCase } from "../types/testCase.type.js";
import { validateNormalRequest } from "../validators/normal.validator.js";

export const validate = (status: number, result: Result, testCase: TestCase) => {
    const errors: string[] = [];
    if (status !== testCase.expectedStatus) {
        errors.push(`Expected status ${status} but received ${testCase.expectedStatus}`);
    }

    validateNormalRequest(result, errors);

    return {
        passed: errors.length === 0,
        errors,
    };
};
