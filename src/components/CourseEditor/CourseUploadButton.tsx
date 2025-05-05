import { createResource } from 'solid-js';
import { useCourseStore, type ICourseStore } from "../../global-state/course";

export interface ICourseSaveButtonProps {
    courseIdx: number;
}

const CourseUploadButton = (props: ICourseSaveButtonProps) => {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    let errorDialogRef: HTMLDialogElement | null = null;
    let okDialogRef: HTMLDialogElement | null = null;

    const done = () => {
        okDialogRef?.close();
        errorDialogRef?.close();
    }

    const handleLoad = async () => {
        if (courseStore.loading) return;

        alert('todo')
        courseStore()?.loadCourseFromFile(props.courseIdx);

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
            <button title="Load a course from a file" class="large-icon-button" onClick={() => handleLoad()}>
                <i class='icon-upload' />
            </button>

            <dialog ref={el => (errorDialogRef = el)} class='dialog-error'>
                <header>
                    <h3>Error loading course</h3>
                </header>
                <footer>
                    <button class="large-icon-button" onClick={() => done()}>
                        <span class="utf8-icon-close" />
                    </button>
                </footer>
            </dialog>

            <dialog ref={el => (okDialogRef = el)} class='dialog-ok'>
                <header>
                    <h3>Course Loaded</h3>
                </header>
                <footer>
                    <button class="large-icon-button utf8-icon-tick" onClick={() => errorDialogRef?.close()} />
                </footer>
            </dialog >
        </>
    );
};

export default CourseUploadButton;
