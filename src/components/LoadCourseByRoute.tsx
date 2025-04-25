import { createResource, createEffect } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { useConfigContext } from "../contexts/ConfigProvider";
import { courseTitlesInIndexOrder, useCourseStore, type ICourseStore } from "../global-state/course";
import { RouteFragementInitCourse } from "../Routes";

const loadedCourses = new Set<string>();

export default function LoadCourseByRoute() {
    const { config } = useConfigContext();
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();
    const navigate = useNavigate();

    createEffect(() => {
        if (courseStore.loading) return;
        const courseIdx = params.courseIdx;
        if (!courseIdx) return;

        if (courseIdx === RouteFragementInitCourse) {
            const newIdx = courseTitlesInIndexOrder(config).length;
            courseStore()?.initNewCourse(newIdx);
            navigate(`/editor/${newIdx}`, { replace: true });
            return;
        }

        const numericIdx = Number(courseIdx);
        if (!isNaN(numericIdx) && !loadedCourses.has(courseIdx)) {
            loadedCourses.add(courseIdx);
            courseStore()?.loadCourseFromFile(numericIdx);
        }
    });

    return null;
}
