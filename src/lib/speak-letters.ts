export type LanguageCode = 'heb' | 'ang';

interface LanguageDataEntry {
    langTag: string;
    letters: Record<string, string>;
}

// Try to cut down the loading delay
let voice: SpeechSynthesisVoice | undefined;
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
        voice = speechSynthesis.getVoices().find(
            (v) => v.lang.startsWith('en') && v.localService
        );
    };
}

const languageData: Record<LanguageCode, LanguageDataEntry> = {
    heb: {
        langTag: 'en-GB', // speak Hebrew letters in English
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
            'ך': 'kaf',
            'ל': 'lamed',
            'מ': 'mem',
            'ם': 'mem',
            'נ': 'nun',
            'ן': 'nun',
            'ס': 'samekh',
            'ע': 'ayin',
            'פ': 'pe',
            'ף': 'pe',
            'צ': 'tsadi',
            'ץ': 'tsadi',
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
    if (!voice) return;

    if (!letter || !langCode) {
        console.warn('Missing letter or language code');
        return;
    }

    const data = languageData[langCode];
    if (!data) {
        console.warn('Unsupported language code:', langCode);
        return;
    }

    const normalizedLetter = letter.toLocaleLowerCase();

    const name = data.letters[normalizedLetter];

    if (!name) {
        console.warn(`Letter name not found for '${letter}' in language '${langCode}'`);
        return;
    }

    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = data.langTag;
    utterance.rate = 0.75;
    if (voice) {
        utterance.voice = voice;
    }

    // Cancel any existing queue
    speechSynthesis.cancel();

    speechSynthesis.speak(utterance);

    console.log(utterance)
}
