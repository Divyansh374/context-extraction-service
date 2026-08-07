import { Token } from "../types/token.js";

export const word_scorer = (token: Token) => {
    switch (token.pos) {
        case "PROPN":
            return 10;
        case "NOUN":
            return 7;
        default:
            return 0;
    }
};

export const phrase_scorer = (first: Token, second: Token) => {
    let result: number = 0;

    if (first.pos === "ADJ" && second.pos === "NOUN") {
        result += 12;
    } else if (first.pos === "NOUN" && second.pos === "NOUN") {
        result += 14;
    } else if (first.pos === "PROPN" && second.pos === "NOUN") {
        result += 15;
    } else if (first.pos === "VERB" && second.pos === "NOUN") {
        result += 9;
    }

    return result + 3;
};
