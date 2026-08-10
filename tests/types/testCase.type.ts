import { Category } from "./category.type.js";

export interface TestCase {
    id: string;
    category: Category;
    name: string;
    body: object;
    expectedStatus: number;
}
