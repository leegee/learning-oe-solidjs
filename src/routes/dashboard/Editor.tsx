import { useNavigate, useParams } from "@solidjs/router";
import EditCardModal from "./details/EditCardModal";
import { createEffect, createSignal } from "solid-js";
import { Lesson } from "../Lessons/Lesson";
import { courseStore } from "../../global-state/course";
import { persist } from "./DashboardCourseOverview";
import { getCourseIndex, setCourseIndex } from "../../global-state/lessons";

const Editor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = createSignal<Lesson[]>([]);

    // Get route parameters
    const courseIdx = Number(params.courseIdx);
    const lessonIdx = Number(params.lessonIdx);
    const cardIdx = Number(params.cardIdx);

    // Ensure courseIdx is updated when it's changed in the params
    createEffect(() => {
        if (courseIdx) {
            setCourseIndex(courseIdx); // Store the courseIdx globally
        } else {
            setCourseIndex(getCourseIndex()); // Fallback to stored courseIdx
        }

        const { lessons } = courseStore.store;
        if (lessons) {
            console.log('Editor set lessons for ', lessonIdx, cardIdx);
            setLessons(lessons); // Update lessons signal
        }
    });

    createEffect(() => {
        console.log('editor lessons: ', lessons()[lessonIdx]?.cards[cardIdx]);
    });

    // Return a loading state if lessons are still being fetched
    if (!lessons()[lessonIdx]?.cards[cardIdx]) {
        return <div>Loading...</div>;
    }

    return (
        <article>
            {lessons()[lessonIdx]?.cards[cardIdx] && (
                <EditCardModal
                    card={lessons()[lessonIdx]?.cards[cardIdx]}
                    onSave={(updatedCard: any) => {
                        const data = [...lessons()]; // Make a copy of lessons
                        data[lessonIdx].cards[cardIdx] = updatedCard; // Update specific card
                        setLessons(data); // Update the lessons signal
                        persist(data); // Persist the updated data
                        navigate(-1); // Go back after saving
                    }}
                    onCancel={() => navigate(`/dashboard/${courseIdx}`)} // Navigate to dashboard
                />
            )}
        </article>
    );
};

export default Editor;
