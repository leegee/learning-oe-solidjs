import { useNavigate } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";
import { useConfirm } from "../../contexts/ConfirmProvider";
import { getCourseStore } from "../../global-state/course";

interface IDeleteCourseButtonProps {
    courseIdx: number;
}

export default function DeleteCourseButton(props: IDeleteCourseButtonProps) {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { showConfirm } = useConfirm();

    const onConfirmed = async () => {
        const courseStore = getCourseStore();
        if (!courseStore) return;

        try {
            await courseStore.deleteCourse(props.courseIdx);
            navigate("/");
        } catch (err) {
            console.error("Failed to delete course:", err);
        }
    };

    const handleDelete = () => {
        if (props.courseIdx == null) {
            console.warn("No course selected.");
            return;
        }
        showConfirm(t("confirm_delete_course"), onConfirmed);
    };

    const courseStore = getCourseStore();

    return (
        <button
            class="large-icon-button icon-trash"
            onClick={handleDelete}
            title={t("delete_course")}
            disabled={!courseStore}
        />
    );
}
