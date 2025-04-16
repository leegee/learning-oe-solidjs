import { useNavigate, useParams } from "@solidjs/router";
import EditCardModal from "../../components/card-editor/EditCardModal";
import { createEffect, createSignal } from "solid-js";
import { Lesson } from "../../components/Lessons/Lesson";
import { courseStore } from "../../global-state/course";
import { persist } from "../../components/course-editor/CourseEditor";
import { getCourseIndex, setCourseIndex } from "../../global-state/lessons";

const Editor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = createSignal<Lesson[]>([]);

    // Directly get courseIdx from params
    const courseIdx = Number(params.courseIdx ?? -1);
    const lessonIdx = Number(params.lessonIdx ?? -1);
    const cardIdx = Number(params.cardIdx ?? -1);

    createEffect(() => {
        if (courseIdx) {
            setCourseIndex(courseIdx);
        } else {
            setCourseIndex(getCourseIndex());
        }
        console.log('done courseidx');
    });

    createEffect(() => {
        const { lessons: courseLessons } = courseStore.store;
        if (courseLessons) {
            console.log('set lessons');
            setLessons(courseLessons);
        }
    });


    if (!lessons || lessonIdx === -1 || cardIdx === -1) {
        return <div>Loading editor... {courseIdx} {lessonIdx} {cardIdx}</div>;
    }

    return (
        <article>
            {lessons()[lessonIdx]?.cards[cardIdx] && (
                <EditCardModal
                    card={lessons()[lessonIdx]?.cards[cardIdx]}
                    onSave={(updatedCard: any) => {
                        const data = [...lessons()];
                        data[lessonIdx].cards[cardIdx] = updatedCard;
                        setLessons(data);
                        persist(data);
                        navigate(-1);
                    }}
                    onCancel={() => navigate(`/editor/${courseIdx}`)}
                />
            )}
        </article>
    );
};

export default Editor;
