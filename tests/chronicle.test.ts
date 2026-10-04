import test from "node:test";
import assert from "node:assert/strict";
import { chapterAtProgress, chapterSegmentProgress, progressAtChapter, scrollProgress } from "../src/lib/chronicle.ts";

test("到达滚动舞台之前停在第一章，离开后停在最后一章", () => {
    assert.equal(chapterAtProgress(scrollProgress(300, 1000, 2400), 4), 0);
    assert.equal(chapterAtProgress(scrollProgress(1500, 1000, 2400), 4), 0);
    assert.equal(chapterAtProgress(scrollProgress(1600, 1000, 2400), 4), 1);
    assert.equal(chapterAtProgress(scrollProgress(2200, 1000, 2400), 4), 2);
    assert.equal(chapterAtProgress(scrollProgress(2800, 1000, 2400), 4), 3);
    assert.equal(chapterAtProgress(scrollProgress(4000, 1000, 2400), 4), 3);
});

test("单条、空列表和无滚动距离不会产生越界的章节索引", () => {
    assert.equal(chapterAtProgress(1, 1), 0);
    assert.equal(chapterAtProgress(1, 0), 0);
    assert.equal(chapterAtProgress(Number.NaN, 4), 0);
    assert.equal(scrollProgress(1000, 1000, 0), 0);
    assert.equal(progressAtChapter(0, 1), 0);
    assert.equal(progressAtChapter(0, 0), 0);
    assert.equal(progressAtChapter(Number.NaN, 4), 0);
    assert.equal(chapterSegmentProgress(1, 0, 1), 0);
});

test("点击任意年份后，章节与连接线末端落在同一个节点", () => {
    for (const count of [2, 4, 7]) {
        for (let index = 0; index < count; index++) {
            const target = progressAtChapter(index, count);
            const progress = scrollProgress(1000 + target * 2400, 1000, 2400);
            assert.equal(chapterAtProgress(progress, count), index);
            for (let segment = 0; segment < count - 1; segment++) {
                const expected = segment < index ? 1 : 0;
                assert.ok(Math.abs(chapterSegmentProgress(progress, segment, count) - expected) < 1e-10);
            }
        }
    }
});

test("手动滚动连续填充相邻年份之间的连接线，并在两节点中点切换章节", () => {
    const from = progressAtChapter(1, 4);
    const to = progressAtChapter(2, 4);
    const beforeMiddle = from + (to - from) * 0.4;
    const afterMiddle = from + (to - from) * 0.6;
    assert.equal(chapterAtProgress(beforeMiddle, 4), 1);
    assert.equal(chapterAtProgress(afterMiddle, 4), 2);
    assert.ok(Math.abs(chapterSegmentProgress(beforeMiddle, 1, 4) - 0.4) < 1e-10);
    assert.ok(Math.abs(chapterSegmentProgress(afterMiddle, 1, 4) - 0.6) < 1e-10);
    assert.equal(chapterSegmentProgress(beforeMiddle, 0, 4), 1);
    assert.equal(chapterSegmentProgress(afterMiddle, 2, 4), 0);
});

test("首尾年份留有阅读距离，进度不会越过轨道端点", () => {
    assert.ok(progressAtChapter(0, 4) > 0);
    assert.ok(progressAtChapter(3, 4) < 1);
    assert.equal(chapterSegmentProgress(0, 0, 4), 0);
    assert.equal(chapterSegmentProgress(1, 2, 4), 1);
    assert.equal(chapterAtProgress(-1, 4), 0);
    assert.equal(chapterAtProgress(2, 4), 3);
});
