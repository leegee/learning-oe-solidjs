import "./AddLessonButton.css";
import { createSignal, createResource, Show, onCleanup } from "solid-js";
import { useCourseStore, type ICourseStore } from "../../global-state/course";

export interface IAddLessonButtonProps {
    lessonIdx?: number;
}

export default function AddLessonButton(props: IAddLessonButtonProps) {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const [showOptions, setShowOptions] = createSignal(false);

    const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest(".add-lesson-button-component")) {
            setShowOptions(false);
        }
    };

    // Close overlay on outside click
    document.addEventListener("click", handleClickOutside);
    onCleanup(() => document.removeEventListener("click", handleClickOutside));

    return (
        <Show when={!courseStore.loading} fallback={<p>Loading...</p>}>
            <div class="add-lesson-button-component">
                <button class="large-icon-button icon-plus-thin"
                    title="Add a new lesson to this course"
                    onClick={() => setShowOptions(prev => !prev)}
                />

                <Show when={showOptions()}>
                    <aside class="add-lesson-overlay">
                        <button class="large-icon-button icon-up-fat"
                            title="Add a new lesson above this"
                            onClick={() => {
                                courseStore()?.addLesson(Number(props.lessonIdx) - 1);
                                setShowOptions(false);
                            }}
                        />
                        <button class="large-icon-button icon-down-fat"
                            title="Add a new lesson beneath this"
                            onClick={() => {
                                courseStore()?.addLesson(Number(props.lessonIdx) + 1);
                                setShowOptions(false);
                            }}
                        />
                    </aside>
                </Show>
            </div>
        </Show>
    );
}
