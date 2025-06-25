import { createResource, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../global-state/course";

export default function LoadCourseByRoute() {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();

    createEffect(async () => {
        if (courseStore.loading) return;

        const courseIdx = params.courseIdx;
        const numericIdx = Number(courseIdx);

        if (!isNaN(numericIdx)) {
            console.log('Load course by route')
            await courseStore()?.loadCourseFromFile(numericIdx);
        } else {
            console.error('Load course by route failure - course index was non-numeric', courseIdx)
        }
    });

    return null;
}
