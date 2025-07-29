export const normalizeText = (text: string): string => {
    return text.trim().toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '')
        .replace(/\s+/g, ' ');
};
