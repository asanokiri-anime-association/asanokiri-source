import { existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load, JSON_SCHEMA } from "js-yaml";
import type { z } from "zod";
import { encode } from "uqr";
import { siteSchema, historySchema, cultureSchema, activitiesSchema, noticeSchema } from "../src/content/schema.ts";
import type { ClubContent, Contact } from "../src/content/schema.ts";
import { renderMarkdown } from "./markdown.ts";

const files = {
    site: "data/site.yml",
    history: "data/history.yml",
    culture: "data/culture.yml",
    activities: "data/activities.yml",
    notice: "data/notice.yml",
} as const;

export const contentFiles = Object.values(files);

function read<T extends z.ZodType>(root: string, file: string, schema: T): z.output<T> {
    const value: unknown = load(readFileSync(join(root, file), "utf8"), { schema: JSON_SCHEMA });
    const result = schema.safeParse(value);
    if (!result.success) {
        throw new Error(
            `${file}\n${result.error.issues.map((issue) => `  ${issue.path.join(".")}: ${issue.message}`).join("\n")}`,
        );
    }
    return result.data;
}

function checkImages(root: string, value: unknown): void {
    if (typeof value === "string" && value.startsWith("/uploads/") && !existsSync(join(root, "public", value))) {
        throw new Error(`图片不存在：${value}`);
    }
    if (Array.isArray(value)) value.forEach((item) => checkImages(root, item));
    else if (value && typeof value === "object") Object.values(value).forEach((item) => checkImages(root, item));
}

function withMarkdown<T extends { text: string }>(item: T) {
    return { ...item, textHtml: renderMarkdown(item.text) };
}

export function loadContent(root: string): ClubContent {
    const site = read(root, files.site, siteSchema);
    const history = read(root, files.history, historySchema).items;
    const culture = read(root, files.culture, cultureSchema);
    const activities = read(root, files.activities, activitiesSchema).items;
    const notice = read(root, files.notice, noticeSchema);
    checkImages(root, { site, history, culture, activities });

    const contacts: Contact[] = site.contacts;
    for (const contact of contacts) {
        if (!contact.qr_link || contact.qr_image) continue;
        const { size, data } = encode(contact.qr_link, { ecc: "H", border: 4 });
        contact.qr_size = size;
        contact.qr_path = data.flatMap((row, y) => row.flatMap((on, x) => (on ? [`M${x} ${y}h1v1h-1z`] : []))).join("");
    }

    return {
        site: { ...site, contacts, departments: site.departments.filter((item) => item.visible).map(withMarkdown) },
        history: history.filter((item) => item.visible).map(withMarkdown),
        culture: {
            ...culture,
            story: withMarkdown(culture.story),
            characters: culture.characters.filter((item) => item.visible).map(withMarkdown),
            works: culture.works.filter((item) => item.visible).map(withMarkdown),
        },
        activities: activities
            .filter((item) => item.visible)
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((item) => ({
                ...item,
                summaryHtml: renderMarkdown(item.summary),
            })),
        notice,
    };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const content = loadContent(fileURLToPath(new URL("../", import.meta.url)));
    console.log(
        `内容校验通过：${content.site.departments.length} 个部门，${content.culture.characters.length} 位角色，${content.activities.length} 项活动。`,
    );
}
