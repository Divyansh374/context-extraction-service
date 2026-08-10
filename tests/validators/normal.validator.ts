import { Result } from "../types/result.type.js";

export const validateNormalRequest = (result: Result, errors: string[]) => {
    if (!result) {
        errors.push("Result is empty");
        return errors;
    }

    if (typeof result.topic !== "string") {
        errors.push("topic must be a string");
    }

    if (typeof result.industry !== "string") {
        errors.push("industry must be a string");
    }

    if (!result.sources) {
        errors.push("sources is missing");
    }

    if (!result.report) {
        errors.push("report is missing");
    }

    if (!Array.isArray(result.report?.signals)) {
        errors.push("report.signals must be an array");
    }
};
