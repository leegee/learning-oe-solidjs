import { createResource, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../global-state/course";

const loadedCourses = new Set<string>();

export default function LoadCourseByRoute() {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();

    createEffect(async () => {
        if (courseStore.loading) return;
        const courseIdx = params.courseIdx;
        if (!courseIdx) return;

        const numericIdx = Number(courseIdx);
        if (!isNaN(numericIdx) && !loadedCourses.has(courseIdx)) {
            loadedCourses.add(courseIdx);
            await courseStore()?.loadCourseFromFile(numericIdx);
            console.log('Loaded course by route')
        }
    });

    return null;
}
