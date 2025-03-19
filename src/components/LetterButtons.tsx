import { t } from '../i18n';

interface Letter {
    symbol: string;
    name: string;
}

const Letters: Record<string, Letter[]> = {
    'ang': [
        { symbol: 'æ', name: 'ash' },
        { symbol: 'ø', name: 'o-slash' },
        { symbol: 'þ', name: 'thorn' },
        { symbol: 'ð', name: 'eth' },
        { symbol: 'ȝ', name: 'yogh' },
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

const LetterButtons = ({ lang, onSelect }: LetterButtonsProps) => {


    const letters = Letters[lang];

    const handleLetterButtonClick = (letter: string) => {
        onSelect(letter);
    };

    return (
        <div class="letter-buttons">
            {letters.map((letter, index) => (
                <button
                    key={index}
                    onClick={() => handleLetterButtonClick(letter.symbol)}
                    aria-label={t(`insert_${letter.name}`)}
                >
                    {letter.symbol}
                </button>
            ))}
        </div>
    );
};

export default LetterButtons;
