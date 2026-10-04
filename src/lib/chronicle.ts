// 每章的阅读区间以年份节点为中心，首尾各保留半章的停留距离。
function chapterPosition(progress: number, count: number): number {
    if (count <= 1 || !Number.isFinite(progress)) return 0;
    return Math.min(count - 1, Math.max(0, progress * count - 0.5));
}

export function chapterAtProgress(progress: number, count: number): number {
    return Math.round(chapterPosition(progress, count));
}

export function progressAtChapter(index: number, count: number): number {
    if (count <= 1 || !Number.isFinite(index)) return 0;
    return (Math.min(count - 1, Math.max(0, index)) + 0.5) / count;
}

export function chapterSegmentProgress(progress: number, index: number, count: number): number {
    return Math.min(1, Math.max(0, chapterPosition(progress, count) - index));
}

export function scrollProgress(scrollTop: number, start: number, distance: number): number {
    if (distance <= 0) return 0;
    return Math.min(1, Math.max(0, (scrollTop - start) / distance));
}
