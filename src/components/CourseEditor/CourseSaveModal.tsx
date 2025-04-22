import { createResource } from 'solid-js';
import { useCourseStore, type ICourseStore } from "../../global-state/course";

export interface ICourseSaveButtonProps {
    courseIdx: number;
}

const CourseSaveButton = (props: ICourseSaveButtonProps) => {
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());
    let errorDialogRef: HTMLDialogElement | null = null;

    const handleSave = async () => {
        if (courseStore.loading) return;

        courseStore()?.setCourseIdx(props.courseIdx);
        const filename = 'lessons.lson.json';

        try {
            if ('showSaveFilePicker' in window) {
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: filename,
                    types: [{ description: "Lessons", accept: { "application/json": [".lson.json"] } }],
                });

                const writable = await handle.createWritable();
                await writable.write(
                    JSON.stringify(courseStore()!.store.lessons, null, 2)
                );
                await writable.close();
            }
            else {
                // Fallback: create a blob and simulate download
                const blob = new Blob([
                    JSON.stringify(courseStore()!.store.lessons, null, 2)
                ], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
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
            <button class="icon-download course-save-button" onClick={() => handleSave()} />

            <dialog ref={el => (errorDialogRef = el)} class='dialog-error'>
                <p>Error saving lessons</p>
                <button onClick={() => errorDialogRef?.close()}>✕</button>
            </dialog>
        </>
    );
};

export default CourseSaveButton;
