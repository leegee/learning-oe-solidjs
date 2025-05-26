import { createResource } from 'solid-js';
import { useCourseStore, type ICourseStore } from "../../global-state/course";

const CourseUploadButton = () => {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    let errorDialogRef: HTMLDialogElement | null = null;
    let okDialogRef: HTMLDialogElement | null = null;
    let fileInputRef: HTMLInputElement | null = null;

    const done = () => {
        okDialogRef?.close();
        errorDialogRef?.close();
    };

    const handleButtonClick = () => fileInputRef?.click();

    const handleImportFile = async (e: Event) => {
        console.log("loadCourseFromFile enter");

        if (courseStore.loading) return;

        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        try {
            console.log("Selected file:", file.name);
            const fileText = await file.text();
            console.log(fileText);
            await courseStore()?.saveCourseToStorage(fileText);
            okDialogRef?.showModal();
        }
        catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.error("Error loading file:", err);
                errorDialogRef?.showModal();
            }
        } finally {
            if (fileInputRef) fileInputRef.value = "";
        }
    };

    return (
        <>
            <button
                title="Load a course from a file"
                class="large-icon-button"
                onClick={handleButtonClick}
            >
                <i class="icon-upload" />
            </button>

            <input
                type="file"
                ref={el => (fileInputRef = el)}
                accept=".json"
                style={{ display: "none" }}
                onChange={handleImportFile}
            />

            <dialog ref={el => (errorDialogRef = el)} class="dialog-error">
                <header>
                    <h3>Error loading course</h3>
                </header>
                <footer>
                    <button class="large-icon-button" onClick={done}>
                        <span class="utf8-icon-close" />
                    </button>
                </footer>
            </dialog>

            <dialog ref={el => (okDialogRef = el)} class="dialog-ok">
                <header>
                    <h3>Course Loaded</h3>
                </header>
                <footer>
                    <button class="large-icon-button utf8-icon-tick" onClick={done} />
                </footer>
            </dialog>
        </>
    );
};

export default CourseUploadButton;
