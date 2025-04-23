import { createResource } from 'solid-js';
import { useCourseStore, type ICourseStore } from "../../global-state/course";

export interface ICourseSaveButtonProps {
    courseIdx: number;
}

const CourseLoadButtons = (props: ICourseSaveButtonProps) => {
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());
    let errorDialogRef: HTMLDialogElement | null = null;
    let okDialogRef: HTMLDialogElement | null = null;

    const handleLoad = async () => {
        if (courseStore.loading) return;

        courseStore()?.setCourseIdx(props.courseIdx);

        try {
            okDialogRef?.showModal();
        }
        catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.error("Error saving file:", err);
                errorDialogRef?.showModal();
            }
        }
    }

    return (
        <>
            <button class="utf8-icon-new large-icon-button" onClick={() => handleLoad()} />

            <dialog ref={el => (errorDialogRef = el)} class='dialog-error'>
                <header>
                    <h3>Error loading course</h3>
                </header>
                <footer>
                    <button class="large-icon-button" onClick={() => errorDialogRef?.close()}>
                        <span class="utf8-icon-close" />
                    </button>
                </footer>
            </dialog>

            <dialog ref={el => (okDialogRef = el)} class='dialog-ok'>
                <header>
                    <h3>Course Loaded</h3>
                </header>
                <footer>
                    <button class="large-icon-button" onClick={() => errorDialogRef?.close()}>
                        <span class="utf8-icon-tick" />
                    </button>
                </footer>
            </dialog >
        </>
    );
};

export default CourseLoadButtons;
