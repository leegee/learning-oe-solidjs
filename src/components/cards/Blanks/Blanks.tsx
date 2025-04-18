import './Blanks.css';
import { createSignal, createEffect, type JSX } from 'solid-js';
import { shuffleArray } from '../../../lib/shuffle-array';
import { type IBaseCard } from '../BaseCard.type';
import { setQandALangs, setQandALangsReturnType } from '../../../lib/set-q-and-a-langs';
import ActionButton from '../../ActionButton';
import { useI18n } from '../../../contexts/I18nProvider';

export interface IBooleanWord {
    [word: string]: boolean
};

export interface IBlanksCard extends IBaseCard {
    class: 'blanks';
    question: string;
    words: IBooleanWord[]
}

export const defaultCard: IBlanksCard = {
    class: 'blanks',
    question: '',
    qlang: 'default',
    words: [],
};

export interface IBlanksCardProps {
    card: IBlanksCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const BlanksCardComponent = (props: IBlanksCardProps) => {
    const { t } = useI18n();
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(props.card));
    const [shuffledWords, setShuffledWords] = createSignal<string[]>([]);
    const [selectedWords, setSelectedWords] = createSignal<string[]>([]);
    const [isComplete, setIsComplete] = createSignal<null | boolean>(null);

    const [currentSentence, setCurrentSentence] = createSignal<JSX.Element[]>([]);

    const [shake, setShake] = createSignal<string | null>(null);

    createEffect(() => {
        setShuffledWords(shuffleArray(props.card.words.map(word => Object.keys(word)[0])));
        setLangs(setQandALangs(props.card));

        const initialSentence = props.card.question.split(/[\s\b]/).reduce((acc, word) => {
            if (/^_{2,}/.test(word)) {
                acc.push(
                    <span class={currentSentence().includes(word) ? 'blank-correct' : 'blank'}>
                        {'__'}
                    </span>
                );
            } else {
                acc.push(<span class='provided-word'>{word}</span>);
            }
            return acc;
        }, [] as JSX.Element[]);
        setCurrentSentence(initialSentence);
    });

    const handleWordClick = (word: string) => {
        const firstBlankIndex = currentSentence().findIndex((el) => el instanceof HTMLElement && el.classList.contains('blank'));

        if (firstBlankIndex === -1) {
            return;
        }

        const isCorrect = props.card.words.find((item) => item[word]);

        if (isCorrect) {
            const updatedSentence = [...currentSentence()];
            updatedSentence[firstBlankIndex] = <span class="blank-correct">{word}</span>;
            setCurrentSentence(updatedSentence);
            setSelectedWords([...selectedWords(), word]);
            props.onCorrect();
        }
        else {
            setShake(word);
            setTimeout(() => setShake(null), 1000);
            props.onIncorrect();
        }
    };

    createEffect(() => {
        const correctOrder = props.card.words.filter(word => Object.values(word)[0]).map(item => Object.keys(item)[0]);
        if (selectedWords().length === correctOrder.length && selectedWords().every((word, index) => word === correctOrder[index])) {
            setIsComplete(true);
        }
    });

    const handleNextClick = () => {
        if (isComplete()) {
            props.onComplete();
        }
    };

    return (
        <>
            <section class="card blanks-card">
                <h4>{t('fill_in_the_blanks')}</h4>
                <h3 class="question" lang={langs().q}>
                    {currentSentence()}
                </h3>

                <div class="word-options">
                    {shuffledWords().map((word) => {
                        const isSelected = selectedWords().includes(word);
                        const isCorrect = props.card.words.some((item) => Object.keys(item)[0] === word && Object.values(item)[0]);
                        const shakeClass = shake() === word ? 'shake' : '';
                        const className = 'word-option ' + (isSelected ? (isCorrect ? 'correct' : 'incorrect') : '') + shakeClass;

                        return (
                            <button
                                lang={langs().a}
                                onClick={() => handleWordClick(word)}
                                disabled={isSelected}
                                class={className}
                            >
                                {word}
                            </button>
                        );
                    })}
                </div>
            </section>

            <ActionButton
                isCorrect={isComplete()}
                isInputPresent={isComplete() ? true : false}
                onCheckAnswer={handleNextClick}
                onComplete={props.onComplete}
            />

        </>
    );
};

export default BlanksCardComponent;
