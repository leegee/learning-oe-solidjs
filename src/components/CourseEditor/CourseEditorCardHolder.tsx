import { createResource, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { useI18n } from "../../contexts/I18nProvider";
import { useConfirm } from '../../contexts/ConfirmProvider';
import { ILesson } from "../Lessons/Lesson";
import Card from "../Lessons/Card";
import { IAnyCard } from "../Cards";

interface ICourseEditorCardHolderProps {
    lesson: ILesson;
    lessonIdx: number;
    card: IAnyCard;
    cardIdx: number;
}

export default function CourseEditorCardHolder(props: ICourseEditorCardHolderProps) {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const { showConfirm } = useConfirm();
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();

    const cloneLesson = (lesson: ILesson) => ({
        ...lesson,
        cards: [...lesson.cards],
    });

    const confirmDeleteCard = () => {
        if (courseStore.loading) return;
        showConfirm(
            t('confirm_delete_card'),
            () => courseStore()!.deleteCard(Number(props.lessonIdx), Number(props.cardIdx))
        );
    };

    const moveCard = (lessonIdx: number, cardIdx: number, direction: number) => {
        const originalLessons = courseStore()!.getLessons();
        const updatedLessons = [...originalLessons];

        const lesson = cloneLesson(updatedLessons[lessonIdx]);
        const cards = [...lesson.cards];
        const newCardIdx = cardIdx + direction;

        if (newCardIdx < 0 || newCardIdx >= cards.length) return;

        const [movedCard] = cards.splice(cardIdx, 1);
        cards.splice(newCardIdx, 0, movedCard);

        lesson.cards = cards;
        updatedLessons[lessonIdx] = lesson;
        courseStore()!.setLessons(updatedLessons);
    };

    const moveCardBetweenLessons = (lessonIdx: number, cardIdx: number, direction: number) => {
        if (courseStore.loading) return 'Loading...';
        const originalLessons = courseStore()!.getLessons();
        const newLessonIdx = lessonIdx + direction;

        if (
            newLessonIdx < 0 ||
            newLessonIdx >= originalLessons.length ||
            cardIdx < 0 ||
            cardIdx >= originalLessons[lessonIdx].cards.length
        ) return;

        const updatedLessons = [...originalLessons];
        const fromLesson = cloneLesson(updatedLessons[lessonIdx]);
        const toLesson = cloneLesson(updatedLessons[newLessonIdx]);

        const fromCards = [...fromLesson.cards];
        const toCards = [...toLesson.cards];

        const [movedCard] = fromCards.splice(cardIdx, 1);
        toCards.push(movedCard);

        fromLesson.cards = fromCards;
        toLesson.cards = toCards;

        updatedLessons[lessonIdx] = fromLesson;
        updatedLessons[newLessonIdx] = toLesson;

        courseStore()!.setLessons(updatedLessons);
    };

    return (
        <Show when={!courseStore.loading} fallback={<p>Loading...?!</p>}>
            <div class="card-holder">
                <div class="vertical-controls top-controls">
                    <button
                        title="Move up to the previous lesson"
                        class="move-card-button icon-up-fat"
                        disabled={props.lessonIdx === 0}
                        onClick={() => moveCardBetweenLessons(props.lessonIdx, props.cardIdx, -1)}
                    />
                </div>

                <div class="horizontal-controls">
                    <button
                        title="Swap with the card on the left"
                        class="move-card-button icon-left-fat"
                        disabled={props.cardIdx === 0}
                        onClick={() => moveCard(props.lessonIdx, props.cardIdx, -1)}
                    />

                    <div class="card-overlay-wrapper">
                        <Card
                            tabindex={-1}
                            card={props.card}
                            lesson={props.lesson}
                            ondblclick={() =>
                                navigate(`/editor/${params.courseIdx}/${props.lessonIdx}/${props.cardIdx}`)
                            }
                        />

                        <div class="card-overlay">
                            <button
                                title="Delete"
                                class="control small-control"
                                onClick={() => confirmDeleteCard()}
                            >
                                <span class='icon-trash' />
                            </button>

                            <button
                                title="Edit"
                                class="control"
                                onClick={() =>
                                    navigate(`/editor/${params.courseIdx}/${props.lessonIdx}/${props.cardIdx}`)
                                }
                            >
                                <span class='icon-pencil' />
                            </button>
                        </div>
                    </div>

                    <button
                        title="Swap with the card to the right"
                        class="move-card-button icon-right-fat"
                        disabled={props.cardIdx === props.lesson.cards.length - 1}
                        onClick={() => moveCard(props.lessonIdx, props.cardIdx, 1)}
                    />
                </div>

                <div class="vertical-controls bottom-controls">
                    <button
                        title="Move to the next lesson"
                        class="move-card-button icon-down-fat"
                        onClick={() => moveCardBetweenLessons(props.lessonIdx, props.cardIdx, 1)}
                        disabled={props.lessonIdx === courseStore()!.getLessons().length - 1}
                    />
                </div>
            </div>
        </ Show>
    );
}

