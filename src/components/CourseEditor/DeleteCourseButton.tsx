import { useNavigate } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { useI18n } from "../../contexts/I18nProvider";
import { createResource } from "solid-js";
import { useConfirm } from "../../contexts/ConfirmProvider";

interface IDeleteCourseButtonProps {
    courseIdx: number;
}

export default function DeleteCourseButton(props: IDeleteCourseButtonProps) {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const { t } = useI18n();
    const navigate = useNavigate();
    const { showConfirm } = useConfirm();

    const onConfirmed = async () => {
        try {
            await courseStore()!.deleteCourse(props.courseIdx);
            navigate("/");
        } catch (err) {
            console.error("Failed to delete course:", err);
        }
    }

    const handleDelete = async () => {
        if (props.courseIdx == null) {
            console.warn("No course selected.");
            return;
        }
        if (courseStore.loading) return;

        showConfirm(t('confirm_delete_course'), onConfirmed)
    }
    return (
        <button class="large-icon-button icon-trash" onClick={handleDelete} title={t('delete_course')} />
    );
}
