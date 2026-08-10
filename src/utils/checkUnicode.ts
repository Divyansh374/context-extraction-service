export const hasInvalidUnicode = (value: string): boolean => {
    for (let i: number = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);

        if (code >= 0xd800 && code <= 0xdbff) {
            const next = value.charCodeAt(i + 1);

            if (next < 0xdc00 || next > 0xdfff) {
                return true;
            }

            i++;
            continue;
        }

        if (code >= 0xdc00 && code <= 0xdfff) {
            return true;
        }
    }

    return false;
};
