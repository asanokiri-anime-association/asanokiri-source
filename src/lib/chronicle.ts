// 连接线末端位置是时间轴唯一的阅读状态，以节点为单位：0 为首个年份，count - 1 为末个年份。
// 每段连接线占相同的滚动距离，随滚动线性前进，起点不留停顿；到达下一节点时切换章节，末个年份之后再前进半段连接线。
const TAIL = 0.5;

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

export function railPosition(progress: number, count: number): number {
    if (count <= 1 || !Number.isFinite(progress)) return 0;
    return clamp(progress, 0, 1) * (count - 1 + TAIL);
}

// 当前章节是连接线最后到达的节点；连接线尚未到达的节点不会成为当前章节。
export function chapterAtRail(rail: number, count: number): number {
    return clamp(Math.floor(rail), 0, Math.max(0, count - 1));
}

// 第 index 段连接线从节点 index 出发；末个年份之后的一段只有半段长。
export function segmentFill(rail: number, index: number, count: number): number {
    return clamp((rail - index) / (index === count - 1 ? TAIL : 1), 0, 1);
}

// 点击年份的页面滚动位置：连接线恰好到达该节点。浏览器按设备像素对齐滚动位置，可能停在目标之前
// 不到一个设备像素处，Safari 还会把目标截断为整数。因此落点取节点之后留出一个设备像素余量的整像素，
// 任何对齐方式下都不会落回上一章。
export function scrollTopAtChapter(index: number, count: number, start: number, distance: number, pixelRatio: number): number {
    const node = count > 1 && Number.isFinite(index) ? clamp(index, 0, count - 1) : 0;
    const devicePixel = pixelRatio > 0 ? 1 / pixelRatio : 1;
    return Math.floor(start + (node / (count - 1 + TAIL)) * distance + devicePixel) + 1;
}

export function scrollProgress(scrollTop: number, start: number, distance: number): number {
    if (distance <= 0) return 0;
    return clamp((scrollTop - start) / distance, 0, 1);
}
