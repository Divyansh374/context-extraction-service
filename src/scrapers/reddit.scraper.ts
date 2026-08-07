export const searchReddit = async (keywords: string[]) => {
    for (let i: number = 0; i < keywords.length; i++) {
        if (keywords[i].split(" ").length > 1) {
            continue;
        }
    }
};
