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
