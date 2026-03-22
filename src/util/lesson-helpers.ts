import { Lesson } from "@/data/lessons";

export const DIFF_COLORS = {
    Beginner: { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)" },
    Intermediate: { color: "#facc15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)" },
    Advanced: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};

export function estimateReadTime(lesson: Lesson): number {
    const words = lesson.sections.reduce((acc, s) => {
        let count = s.body.split(/\s+/).length;
        s.codeBlocks?.forEach((cb) => (count += cb.code.split(/\s+/).length * 0.5));
        return acc + count;
    }, 0);
    return Math.max(2, Math.round(words / 200));
}