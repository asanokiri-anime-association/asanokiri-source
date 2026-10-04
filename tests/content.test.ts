import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { dump, load, JSON_SCHEMA } from "js-yaml";
import { loadContent, contentFiles } from "../scripts/content.ts";
import { noticeSchema } from "../src/content/schema.ts";
import { isNoticeActive, noticeStorageKey } from "../src/lib/notice.ts";

function fixture(t: TestContext) {
    const prefix = join(tmpdir(), "asanokiri-content-");
    const root = mkdtempSync(prefix);
    mkdirSync(join(root, "data"));
    const write = (file: string, value: unknown) => writeFileSync(join(root, `data/${file}.yml`), dump(value));
    write("site", { name: "测试社团" });
    write("history", { items: [] });
    write("culture", {});
    write("activities", { items: [] });
    write("notice", { enabled: false });
    t.after(() => {
        if (!resolve(root).startsWith(resolve(prefix))) throw new Error("临时目录路径不符");
        rmSync(root, { recursive: true, force: true });
    });
    return { root, write };
}

const notice = {
    enabled: true,
    id: "test",
    title: "测试公告",
    text: "",
    event_time: "9 月 15 日",
    location: "测试地点",
    starts_at: "2026-09-01T08:00:00+08:00",
    ends_at: "2026-09-16T00:00:00+08:00",
};

test("公告在开始时刻出现，结束时刻隐藏，关闭开关始终隐藏", () => {
    const start = Date.parse(notice.starts_at);
    const end = Date.parse(notice.ends_at);
    assert.equal(isNoticeActive(notice, start - 1), false);
    assert.equal(isNoticeActive(notice, start), true);
    assert.equal(isNoticeActive(notice, end - 1), true);
    assert.equal(isNoticeActive(notice, end), false);
    assert.equal(isNoticeActive({ ...notice, enabled: false }, start), false);
});

test("改过内容的公告可重新提示，普通刷新保持收起状态", () => {
    assert.equal(noticeStorageKey(notice), noticeStorageKey({ ...notice }));
    assert.notEqual(noticeStorageKey(notice), noticeStorageKey({ ...notice, location: "新地点" }));
    assert.notEqual(noticeStorageKey(notice), noticeStorageKey({ ...notice, ends_at: "2026-09-17T00:00:00+08:00" }));
});

test("启用公告必须包含时间、地点和有效的带时区时间范围", () => {
    assert.equal(noticeSchema.safeParse(notice).success, true);
    for (const invalid of [
        { location: "" },
        { ends_at: notice.starts_at },
        { starts_at: "2026-09-01T08:00:00" },
        { starts_at: "2026-02-30T08:00:00+08:00" },
    ])
        assert.equal(noticeSchema.safeParse({ ...notice, ...invalid }).success, false);
    assert.equal(noticeSchema.safeParse({ enabled: false }).success, true);
});

test("最少内容和空栏目可构建，不需要虚构占位文章", (t) => {
    const { root } = fixture(t);
    const content = loadContent(root);
    assert.equal(content.site.name, "测试社团");
    assert.deepEqual(content.activities, []);
    assert.deepEqual(content.culture.works, []);
});

test("隐藏内容不输出，活动按日期倒序，只有年份的旧资料仍可保留", (t) => {
    const { root, write } = fixture(t);
    write("activities", {
        items: [
            { title: "旧记录", date: "2021" },
            { title: "不公开", date: "2026-10-01", visible: false },
            { title: "新记录", date: "2026-09-01" },
        ],
    });
    write("culture", {
        characters: [{ name: "隐藏角色", visible: false }],
        works: [{ title: "公开作品" }],
    });
    const content = loadContent(root);
    assert.deepEqual(
        content.activities.map((item) => item.title),
        ["新记录", "旧记录"],
    );
    assert.equal(content.culture.characters.length, 0);
    assert.equal(content.culture.works.length, 1);
});

test("CMS 保存的未加引号日期保持文本与时区", (t) => {
    const { root, write } = fixture(t);
    write("notice", notice);
    writeFileSync(join(root, "data/activities.yml"), "items:\n  - title: 测试活动\n    date: 2026-09-01\n");
    assert.equal(loadContent(root).activities[0]?.date, "2026-09-01");
    assert.equal(loadContent(root).notice.starts_at, notice.starts_at);
});

test("构建会解析各类 CMS 正文，保留原始文本供类型和来源追踪", (t) => {
    const { root, write } = fixture(t);
    write("site", { name: "测试社团", departments: [{ name: "映研", text: "**影像**记录" }] });
    write("history", { items: [{ year: "2026", title: "相遇", text: "第一段。\n\n第二段。" }] });
    write("culture", {
        story: { title: "物语", text: "# 世界\n\n故事。" },
        characters: [{ name: "角色", text: "*伙伴*" }],
        works: [{ title: "作品", text: "[观看](https://example.com)" }],
    });
    write("activities", { items: [{ title: "活动", date: "2026", summary: "- 放映\n- 交流" }] });
    const content = loadContent(root);
    assert.equal(content.site.departments[0]?.text, "**影像**记录");
    assert.match(content.site.departments[0]?.textHtml ?? "", /<strong>影像<\/strong>/);
    assert.match(content.history[0]?.textHtml ?? "", /<p>第一段。<\/p>\s*<p>第二段。<\/p>/);
    assert.match(content.culture.story.textHtml, /<h3>世界<\/h3>/);
    assert.match(content.culture.characters[0]?.textHtml ?? "", /<em>伙伴<\/em>/);
    assert.match(content.culture.works[0]?.textHtml ?? "", /rel="noopener noreferrer"/);
    assert.match(content.activities[0]?.summaryHtml ?? "", /<ul>/);
});

test("内容错误阻止构建并指出文件和字段", (t) => {
    const { root, write } = fixture(t);
    write("activities", { items: [{ title: "错误日期", date: "2026-02-30" }] });
    assert.throws(() => loadContent(root), /data\/activities.yml[\s\S]*items.0.date/);
    write("activities", {
        items: [{ title: "错误链接", date: "2026", link: "javascript:alert(1)" }],
    });
    assert.throws(() => loadContent(root), /items.0.link/);
    write("activities", { items: [] });
    write("site", { name: "测试社团", home_image: "/uploads/missing.jpg" });
    assert.throws(() => loadContent(root), /图片不存在/);
});

test("CMS 覆盖所有数据文件，字段可保存现有内容", () => {
    const root = new URL("../", import.meta.url);
    interface CmsField {
        name: string;
        fields?: CmsField[];
    }
    const config = load(readFileSync(new URL("public/admin/config.yml", root), "utf8"), {
        schema: JSON_SCHEMA,
    }) as { collections: { files: { file: string; fields: CmsField[] }[] }[] };
    const files = config.collections.flatMap((collection) => collection.files);
    assert.deepEqual(files.map((file) => file.file).sort(), [...contentFiles].sort());
    function check(value: unknown, fields: CmsField[]): void {
        assert.ok(value && typeof value === "object" && !Array.isArray(value));
        for (const [key, data] of Object.entries(value)) {
            const field = fields.find((field) => field.name === key);
            assert.ok(field, `CMS 中缺少 ${key} 字段`);
            const children = field.fields;
            if (children && Array.isArray(data)) data.forEach((item) => check(item, children));
            else if (children && data) check(data, children);
        }
    }
    for (const file of files)
        check(
            load(readFileSync(new URL(file.file, root), "utf8"), {
                schema: JSON_SCHEMA,
            }),
            file.fields,
        );
});
