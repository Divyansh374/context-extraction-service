import { Category } from "../types/category.type.js";
import { Result } from "../types/result.type.js";
import { TestCase } from "../types/testCase.type.js";
import { validateNormalRequest } from "../validators/normal.validator.js";

export const validate = (
    status: number,
    result: Result,
    testCase: TestCase,
    category: Category,
) => {
    const errors: string[] = [];
    if (status !== testCase.expectedStatus) {
        errors.push(`Expected status ${testCase.expectedStatus} but received ${status}`);
    }

    if (category === "normal-valid") validateNormalRequest(result, errors);

    return {
        passed: errors.length === 0,
        errors,
    };
};
