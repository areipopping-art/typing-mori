/**
 * コース（年齢に合わせる）。いちばん最初に えらぶ
 * - kids：子ども（タイピングのもり）
 * - student：学生（中学・高校）（タイピング教室）
 * - adult：社会人（オフィスタイピング）
 */
export type Course = "kids" | "student" | "adult";

export type CourseInfo = { id: Course; emoji: string; name: string; appName: string; desc: string; appEmoji: string };

export const COURSES: CourseInfo[] = [
  { id: "kids", emoji: "🧒", name: "子ども", appName: "タイピングのもり", appEmoji: "🌳", desc: "ひらがなの ことばで あそぼう" },
  { id: "student", emoji: "🎒", name: "学生（中学・高校）", appName: "タイピング教室", appEmoji: "🏫", desc: "学校の言葉・四字熟語・英単語" },
  { id: "adult", emoji: "💼", name: "社会人", appName: "オフィスタイピング", appEmoji: "🏢", desc: "ビジネス用語・メールの定型文" },
];

export const COURSE_IDS = COURSES.map((c) => c.id);

export function isCourse(v: unknown): v is Course {
  return typeof v === "string" && (COURSE_IDS as string[]).includes(v);
}

export function courseOf(id: Course | null | undefined): CourseInfo {
  return COURSES.find((c) => c.id === id) ?? COURSES[0];
}
