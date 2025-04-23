import { useParams } from '@solidjs/router';
import { createEffect, createResource } from 'solid-js';
import { useCourseStore, type ICourseStore } from '../global-state/course';

const loadedCourses = new Set<string>();

export default function LoadCourseByRoute() {
    const params = useParams();
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());

    createEffect(() => {
        if (courseStore.loading) return;

        const courseIdx = params.courseIdx;
        if (!courseIdx || loadedCourses.has(courseIdx) || isNaN(Number(courseIdx))) return;

        loadedCourses.add(courseIdx);
        courseStore()!.loadCourse(Number(courseIdx));
    });

    return null;
}
