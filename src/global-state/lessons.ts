import Dexie, { Table } from 'dexie';

export interface AnswerEntry {
  id: string; // `${courseId}_${lessonIndex}_${cardIndex}`
  courseId: number;
  lessonIndex: number;
  cardIndex: number;
  answers: string[];
}

export interface CourseProgress {
  courseId: number;
  currentLessonIndex: number;
}

class AppDB extends Dexie {
  answers!: Table<AnswerEntry, string>;
  courseProgress!: Table<CourseProgress, number>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      answers: 'id, courseId, lessonIndex, cardIndex',
      courseProgress: 'courseId'
    });
  }
}

export const connect = (dbname: string) => new AppDB(dbname);

// Simulate fetching course index asynchronously
export const getCurrentCourseIndex = async () => {
  return await getCourseIndex(); // Replace with your actual logic to get the course index
};

// A mock of the getCourseIndex function (you would replace it with actual logic)
async function getCourseIndex() {
  return 1; // Simulate getting a course index
}
