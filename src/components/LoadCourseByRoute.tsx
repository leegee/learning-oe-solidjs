import { createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import { getCourseStore } from "../global-state/course";

export default function LoadCourseByRoute() {
    const courseStore = getCourseStore();
    const params = useParams();

    createEffect(() => {
        const courseIdx = params.courseIdx;

        if (courseIdx === undefined || courseIdx === null) {
            // No course index present (likely on home route) — do nothing
            return;
        }

        const numericIdx = Number(courseIdx);

        if (!isNaN(numericIdx)) {
            console.log('Load course by route');
            courseStore.loadCourseFromFile(numericIdx);
        } else {
            console.error('Load course by route failure - course index was non-numeric', courseIdx);
        }
    });

    return null;
}
