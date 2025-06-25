export type LanguageCode = 'heb' | 'ang';

interface LanguageDataEntry {
    langTag: string;
    letters: Record<string, string>;
}

const languageData: Record<LanguageCode, LanguageDataEntry> = {
    heb: {
        langTag: 'en-GB', // <- speak Hebrew letters in English
        letters: {
            'א': 'aleph',
            'ב': 'bet',
            'ג': 'gimmel',
            'ד': 'dalet',
            'ה': 'he',
            'ו': 'vav',
            'ז': 'zayin',
            'ח': 'chet',
            'ט': 'tet',
            'י': 'yod',
            'כ': 'kaf',
            'ך': 'final kaf',
            'ל': 'lamed',
            'מ': 'mem',
            'ם': 'final mem',
            'נ': 'nun',
            'ן': 'final nun',
            'ס': 'samekh',
            'ע': 'ayin',
            'פ': 'pe',
            'ף': 'final pe',
            'צ': 'tsadi',
            'ץ': 'final tsadi',
            'ק': 'qof',
            'ר': 'resh',
            'ש': 'shin',
            'ת': 'tav',
        },
    },
    ang: {
        langTag: 'en-GB',
        letters: {
            'æ': 'ash',
            'þ': 'thorn',
            'ð': 'eth',
            'ƿ': 'wynn',
            'Ƿ': 'wynn',
            'ȝ': 'yogh',
        },
    },
};


export function speakLetter(letter: string, langCode: LanguageCode): void {
    if (!letter || !langCode) {
        console.warn('Missing letter or language code');
        return;
    }

    const data = languageData[langCode];
    if (!data) {
        console.warn('Unsupported language code:', langCode);
        return;
    }

    const normalizedLetter = letter.toLowerCase();

    const name = data.letters[normalizedLetter];

    if (!name) {
        console.warn(`Letter name not found for '${letter}' in language '${langCode}'`);
        return;
    }

    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = data.langTag;
    speechSynthesis.speak(utterance);
}
