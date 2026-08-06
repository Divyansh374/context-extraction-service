import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";
import { STOP_WORDS } from "../constants/stopWords.js";

const nlp = winkNLP(model);

const its = nlp.its;

interface Token {
    word: string;
    lemma: string;
    pos: string;
}

export const extractKeywords = (topic: string): string[] => {
    const doc = nlp.readDoc(topic);

    const tokens: Token[] = [];

    doc.tokens().each((token) => {
        tokens.push({
            word: token.out(),
            lemma: token.out(its.lemma),
            pos: token.out(its.pos),
        });
    });

    const keywords = new Set<string>();

    for (const token of tokens) {
        if ((token.pos === "NOUN" || token.pos === "PROPN") && !STOP_WORDS.has(token.lemma)) {
            keywords.add(token.lemma);
        }
    }

    for (let i: number = 0; i < tokens.length - 1; i++) {
        const current: Token = tokens[i];
        const next: Token = tokens[i + 1];

        if (
            (current.pos === "NOUN" ||
                current.pos === "ADJ" ||
                current.pos === "PROPN" ||
                (current.pos === "VERB" && current.word.endsWith("ing"))) &&
            (next.pos === "NOUN" || next.pos === "PROPN")
        ) {
            keywords.add(`${current.word} ${next.word}`);
        }
    }

    for (let i: number = 0; i < tokens.length - 2; i++) {
        const a: Token = tokens[i];
        const b: Token = tokens[i + 1];
        const c: Token = tokens[i + 2];

        if (a.pos === "ADJ" && b.pos === "NOUN" && c.pos === "NOUN") {
            keywords.add(`${a.word} ${b.word} ${c.word}`);
        }
    }

    return [...keywords];
};
