import { For } from 'solid-js';

interface Letter {
    symbol: string;
    name: string;
}

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
    onSelect: (text: string) => void;
}

const LetterButtons = (props: LetterButtonsProps) => {
    return (
        <div class="letter-buttons">
            <For each={Letters[props.lang]}>
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
