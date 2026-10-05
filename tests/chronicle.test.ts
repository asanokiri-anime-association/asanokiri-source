import test from "node:test";
import assert from "node:assert/strict";
import { chapterAtRail, railPosition, scrollProgress, scrollTopAtChapter, segmentFill } from "../src/lib/chronicle.ts";

const counts = [2, 3, 4, 7, 11, 13];
const chapterAt = (progress: number, count: number) => chapterAtRail(railPosition(progress, count), count);

test("到达滚动舞台之前停在第一章，离开后停在最后一章", () => {
    // 4 条历程共 3.5 段连接线，每段约 686px。
    assert.equal(chapterAt(scrollProgress(300, 1000, 2400), 4), 0);
    assert.equal(chapterAt(scrollProgress(1680, 1000, 2400), 4), 0);
    assert.equal(chapterAt(scrollProgress(1690, 1000, 2400), 4), 1);
    assert.equal(chapterAt(scrollProgress(2400, 1000, 2400), 4), 2);
    assert.equal(chapterAt(scrollProgress(3100, 1000, 2400), 4), 3);
    assert.equal(chapterAt(scrollProgress(4000, 1000, 2400), 4), 3);
});

test("单条、空列表和无滚动距离不会产生越界的位置", () => {
    assert.equal(railPosition(1, 1), 0);
    assert.equal(railPosition(1, 0), 0);
    assert.equal(railPosition(Number.NaN, 4), 0);
    assert.equal(chapterAtRail(0, 0), 0);
    assert.equal(chapterAtRail(0, 1), 0);
    assert.equal(scrollProgress(1000, 1000, 0), 0);
    assert.equal(scrollTopAtChapter(0, 1, 1000, 2400, 1), 1002);
    assert.equal(scrollTopAtChapter(Number.NaN, 4, 1000, 2400, 1), 1002);
    assert.equal(scrollTopAtChapter(0, 4, 1000, 2400, 0), 1002);
    assert.equal(segmentFill(railPosition(1, 1), 0, 1), 0);
});

test("连接线随滚动线性前进，起点不留停顿", () => {
    for (const count of counts) {
        assert.equal(railPosition(0, count), 0);
        for (let step = 1; step <= 4000; step++) {
            const progress = step / 4000;
            assert.ok(Math.abs(railPosition(progress, count) - progress * (count - 0.5)) < 1e-9);
        }
    }
});

test("任意滚动位置下，节点恰好在连接线到达时点亮并切换章节", () => {
    for (const count of counts) {
        for (let step = 0; step <= 4000; step++) {
            const rail = railPosition(step / 4000, count);
            const chapter = chapterAtRail(rail, count);
            assert.ok(chapter >= 0 && chapter < count);
            for (let node = 1; node < count; node++) {
                assert.equal(node <= chapter, segmentFill(rail, node - 1, count) === 1, "节点点亮当且仅当前一段连接线已填满");
            }
            for (let segment = 0; segment < count; segment++) {
                const fill = segmentFill(rail, segment, count);
                if (fill > 0 && fill < 1) assert.equal(chapter, segment, "连接线行进途中仍停留在出发节点的章节");
            }
        }
    }
});

test("末个年份之后留半段连接线，末章阅读距离为其他章的一半", () => {
    for (const count of counts) {
        assert.equal(railPosition(1, count), count - 0.5);
        assert.equal(segmentFill(railPosition(1, count), count - 1, count), 1);
        assert.equal(segmentFill(count - 0.75, count - 1, count), 0.5);
        const steps = 70000;
        const windows = new Array<number>(count).fill(0);
        for (let step = 0; step < steps; step++) {
            const chapter = chapterAt((step + 0.5) / steps, count);
            windows[chapter] = (windows[chapter] ?? 0) + 1;
        }
        const unit = steps / (count - 0.5);
        windows.forEach((size, chapter) => {
            assert.ok(Math.abs(size - (chapter === count - 1 ? unit / 2 : unit)) <= 1);
        });
    }
});

// 浏览器对滚动目标的处理：Chrome 就近对齐到设备像素并以单精度保存；向下对齐到设备像素；Safari 截断为整数。
const landings = [
    (top: number, ratio: number) => Math.fround(Math.round(top * ratio) / ratio),
    (top: number, ratio: number) => Math.fround(Math.floor(top * ratio) / ratio),
    (top: number) => Math.trunc(top),
];

test("点击年份后连接线恰好到达该节点，浏览器按设备像素对齐也不会落回上一章", () => {
    const ratios = [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.25, 2.625, 2.75, 3, 3.5];
    const starts = [1000, 1347.7, ...Array.from({ length: 40 }, (_, k) => 1300 + k * 0.0371)];
    for (const count of counts) {
        for (const start of starts) {
            for (const distance of [2400, 1978, 1773, 1701.4]) {
                const pixel = (count - 0.5) / distance;
                for (const ratio of ratios) {
                    for (let index = 0; index < count; index++) {
                        const top = scrollTopAtChapter(index, count, start, distance, ratio);
                        assert.ok(Number.isInteger(top));
                        for (const land of landings) {
                            const rail = railPosition(scrollProgress(land(top, ratio), start, distance), count);
                            assert.equal(chapterAtRail(rail, count), index);
                            assert.ok(
                                rail - index <= (1 + 1.5 / ratio) * pixel + 1e-6,
                                "落点越过节点不超过一个 CSS 像素加一个半设备像素",
                            );
                        }
                    }
                }
            }
        }
    }
});
