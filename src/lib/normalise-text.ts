export const normalizeText = (text: string): string => {
    return text.trim().toLocaleLowerCase()
        // .replace(/[^\p{L}\p{N}]+/gu, '')
        .replace(/[^\p{L}\p{N}\s]+/gu, '')
        .replace(/\s+/g, ' ');
};
