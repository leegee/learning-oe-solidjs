import { getCourseStore } from "../../global-state/course";

export type ICourseDownloadButtonProps = {
    courseIdx: number;
};

const CourseDownloadButton = (props: ICourseDownloadButtonProps) => {
    const courseStore = getCourseStore();
    let errorDialogRef: HTMLDialogElement | null = null;

    const handleSave = async () => {
        const filename = "lessons.lson.json";

        try {
            const courseData = await courseStore.getCourseData(props.courseIdx);

            if (!courseData) {
                throw new Error("Lessons not loaded?");
            }

            const blob = new Blob([JSON.stringify(courseData, null, 2)], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.error("Error saving file:", err);
                errorDialogRef?.showModal();
            }
        }
    };

    return (
        <>
            <button
                title="Download this course"
                class="icon-download large-icon-button"
                onClick={handleSave}
            />

            <dialog ref={(el) => (errorDialogRef = el)} class="dialog-error">
                <header>
                    <h3>Error saving lessons</h3>
                </header>
                <footer>
                    <button
                        class="large-icon-button utf8-icon-close"
                        onClick={() => errorDialogRef?.close()}
                    />
                </footer>
            </dialog>
        </>
    );
};

export default CourseDownloadButton;
