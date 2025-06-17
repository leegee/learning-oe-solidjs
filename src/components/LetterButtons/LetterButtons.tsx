import { For } from 'solid-js';

interface Letter {
    symbol: string;
    name: string;
}

const Minimum_To_Provide = 3;

const Letters: Record<string, Letter[]> = {
    'ang': [
        { symbol: 'æ', name: 'Ash' },
        { symbol: 'ø', name: 'o-slash' },
        { symbol: 'þ', name: 'Thorn' },
        { symbol: 'ð', name: 'Eth' },
        { symbol: 'ȝ', name: 'Yogh' },
        { symbol: 'œ', name: 'o-e' },
        { symbol: 'ſ', name: 'long-s' },
        { symbol: 'ƿ', name: 'wynn' },
        { symbol: 'ā', name: 'long-a' },
        { symbol: 'ē', name: 'long-e' },
        { symbol: 'ī', name: 'long-i' },
        { symbol: 'ō', name: 'long-o' },
        { symbol: 'ū', name: 'long-u' },
        { symbol: 'ȳ', name: 'long-y' }
    ],
    'heb': [
        { symbol: 'א', name: 'Alef' },
        { symbol: 'ב', name: 'Bet' },
        { symbol: 'ג', name: 'Gimel' },
        { symbol: 'ד', name: 'Dalet' },
        { symbol: 'ה', name: 'He' },
        { symbol: 'ו', name: 'Vav' },
        { symbol: 'ז', name: 'Zayin' },
        { symbol: 'ח', name: 'Chet' },
        { symbol: 'ט', name: 'Tet' },
        { symbol: 'י', name: 'Yod' },
        { symbol: 'כ', name: 'Kaf' },
        { symbol: 'ך', name: 'Final Kaf' },
        { symbol: 'ל', name: 'Lamed' },
        { symbol: 'מ', name: 'Mem' },
        { symbol: 'ם', name: 'Final Mem' },
        { symbol: 'נ', name: 'Nun' },
        { symbol: 'ן', name: 'Final Nun' },
        { symbol: 'ס', name: 'Samekh' },
        { symbol: 'ע', name: 'Ayin' },
        { symbol: 'פ', name: 'Pe' },
        { symbol: 'ף', name: 'Final Pe' },
        { symbol: 'צ', name: 'Tsadi' },
        { symbol: 'ץ', name: 'Final Tsadi' },
        { symbol: 'ק', name: 'Qof' },
        { symbol: 'ר', name: 'Resh' },
        { symbol: 'ש', name: 'Shin' },
        { symbol: 'ת', name: 'Tav' }
    ],
    'hun': [
        { symbol: 'á', name: 'a-acute' },
        { symbol: 'é', name: 'e-acute' },
        { symbol: 'í', name: 'i-acute' },
        { symbol: 'ó', name: 'o-acute' },
        { symbol: 'ö', name: 'o-umlaut' },
        { symbol: 'ő', name: 'o-double-acute' },
        { symbol: 'ú', name: 'u-acute' },
        { symbol: 'ü', name: 'u-umlaut' },
        { symbol: 'ű', name: 'u-double-acute' }
    ]
};

interface LetterButtonsProps {
    lang: string;
    text: string;
    onSelect: (text: string) => void;
}

const LetterButtons = (props: LetterButtonsProps) => {
    if (!Letters[props.lang]) {
        console.warn(`No buttons exist for the supplied language, "${props.lang}".`);
        return '';
    }

    console.info('Buttons for', props.lang)

    if (props.text.length === 0) {
        return '';
    }

    let filteredLetters = Letters[props.lang].filter(letter => props.text.includes(letter.symbol));

    if (filteredLetters.length < 3) {
        const remainingLetters = Letters[props.lang].filter(letter =>
            !filteredLetters.some(filteredLetter => filteredLetter.symbol === letter.symbol)
        );

        filteredLetters = [...filteredLetters, ...remainingLetters.slice(0, Minimum_To_Provide - filteredLetters.length)];
    }

    return (
        <div class="letter-buttons">
            <For each={filteredLetters}>
                {(letter) => (
                    <button
                        onClick={() => props.onSelect(letter.symbol)}
                        aria-label={letter.name}
                        title={letter.name}
                    >
                        {letter.symbol}
                    </button>
                )}
            </For>
        </div>
    );
};

export default LetterButtons;
