import { useParams, useNavigate } from '@solidjs/router';
import { createEffect, createResource } from 'solid-js';
import { courseTitlesInIndexOrder, useCourseStore, type ICourseStore } from '../global-state/course';
import { useConfigContext } from '../contexts/ConfigProvider';
import { RouteFragementInitCourse } from '../Routes';

const loadedCourses = new Set<string>();

export default function LoadCourseByRoute() {
    const { config } = useConfigContext();
    const params = useParams();
    const navigate = useNavigate();
    const [courseStore] = createResource<ICourseStore>(useCourseStore);

    createEffect(() => {
        if (courseStore.loading) return;

        const courseIdx = params.courseIdx;
        if (!courseIdx || loadedCourses.has(courseIdx)) {
            return;
        }

        if (courseIdx === RouteFragementInitCourse) {
            const courseIdx = courseTitlesInIndexOrder(config).length;
            courseStore()!.initCourse(courseIdx);
            console.log('go')
            return navigate('/editor/' + courseIdx, { replace: true });
        }

        if (isNaN(Number(courseIdx))) {
            return;
        }

        loadedCourses.add(courseIdx);
        courseStore()!.loadCourse(Number(courseIdx));
    });

    return null;
}
