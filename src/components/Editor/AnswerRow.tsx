// AnswerRow component
import './AnswerRow.css';

interface AnswerRowProps {
    option: string;
    index: number;
    isCorrect: boolean;
    answers: string[];
    answer: string;
    updateAnswers: (updatedAnswers: string[]) => void;
    updateAnswer: (newAnswer: string) => void;
}

export default function AnswerRow({
    option,
    index,
    isCorrect,
    answers,
    answer,
    updateAnswers,
    updateAnswer,
}: AnswerRowProps) {
    const handleInputChange = (e: Event) => {
        const updated = [...answers];
        updated[index] = (e.target as HTMLInputElement).value;
        updateAnswers(updated);
    };

    const handleCorrectChange = () => {
        updateAnswer(option);
    };

    const handleRemoveClick = () => {
        const updatedAnswers = [...answers];
        const removed = updatedAnswers.splice(index, 1);
        updateAnswers(updatedAnswers);

        if (answer === removed[0]) {
            updateAnswer("");
        }
    };

    return (
        <div class="answer-row">
            <input
                type="text"
                value={option}
                onInput={handleInputChange}
                title="Text of the answer"
            />
            <label class="answer-label">
                <input
                    title="Correct"
                    type="radio"
                    name="correct-answer"
                    checked={isCorrect}
                    onChange={handleCorrectChange}
                />
                <span class="checkmark" title="Marks this as the correct answer">✔</span>
            </label>
            <button type="button" onClick={handleRemoveClick} title="Remove this answer">
                ✕
            </button>
        </div>
    );
}
