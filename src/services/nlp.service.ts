import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";
import { STOP_WORDS } from "../constants/stopWords.js";
import { phrase_scorer, word_scorer } from "./word_scorer.service.js";
import { GENERIC } from "../constants/genericWords.js";
import { Keyword } from "../types/keyword.js";

const nlp = winkNLP(model);

const its = nlp.its;

interface Token {
    word: string;
    lemma: string;
    pos: string;
}

export const extractKeywords = (topic: string): Keyword[] => {
    const doc = nlp.readDoc(topic);

    const tokens: Token[] = [];

    doc.tokens().each((token) => {
        tokens.push({
            word: token.out(),
            lemma: token.out(its.lemma),
            pos: token.out(its.pos),
        });
    });

    const keywords: Keyword[] = [];

    const frequency: Record<string, number> = {};

    for (const token of tokens) {
        frequency[token.lemma] = 0;
    }

    for (const token of tokens) {
        let score: number = 0;
        const keyword: Keyword | undefined = keywords.find((item) => item.content === token.lemma);

        if (keyword) {
            keyword.score += Math.min(++frequency[token.lemma], 2);
        } else if (
            (token.pos === "NOUN" || token.pos === "PROPN") &&
            !STOP_WORDS.has(token.lemma) &&
            !GENERIC.has(token.lemma)
        ) {
            frequency[token.lemma] += 1;
            score += word_scorer(token);
            keywords.push({
                content: token.lemma,
                score,
            });
        }
    }

    for (let i: number = 0; i < tokens.length - 1; i++) {
        let score: number = 0;

        const current: Token = tokens[i];
        const next: Token = tokens[i + 1];

        const keyword: Keyword | undefined = keywords.find(
            (item) => item.content === `${current.word} ${next.word}`,
        );

        if (keyword) {
            keyword.score += 2;
        } else if (
            (current.pos === "NOUN" ||
                current.pos === "ADJ" ||
                current.pos === "PROPN" ||
                (current.pos === "VERB" && current.word.endsWith("ing"))) &&
            (next.pos === "NOUN" || next.pos === "PROPN")
        ) {
            score += phrase_scorer(current, next);
            keywords.push({
                content: `${current.word} ${next.word}`,
                score,
            });
        }
    }

    for (let i: number = 0; i < tokens.length - 2; i++) {
        let score: number = 0;

        const a: Token = tokens[i];
        const b: Token = tokens[i + 1];
        const c: Token = tokens[i + 2];

        if (a.pos === "ADJ" && b.pos === "NOUN" && c.pos === "NOUN") {
            score += 24;
            keywords.push({
                content: `${a.word} ${b.word} ${c.word}`,
                score,
            });
        }
    }

    keywords
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map((k) => k.content);

    return keywords;
};
