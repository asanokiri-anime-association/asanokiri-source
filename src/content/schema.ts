import { z } from "zod";

const text = z.string().default("");
const requiredText = z.string().trim().min(1, "请填写内容");
const url = z
    .string()
    .refine((value) => {
        if (!value) return true;
        try {
            const parsed = new URL(value);
            return parsed.protocol === "https:" && !!parsed.hostname && !parsed.username && !parsed.password && !/\s/.test(value);
        } catch {
            return false;
        }
    }, "请填写完整的 https:// 链接")
    .default("");
const image = z
    .string()
    .refine((value) => !value || (/^\/uploads\/[^?#]+$/.test(value) && !value.includes("..")), "请选择上传目录中的图片")
    .default("");
const date = z
    .string()
    .refine(
        (value) =>
            /^\d{4}$/.test(value) ||
            (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
                !Number.isNaN(Date.parse(value)) &&
                new Date(value).toISOString().slice(0, 10) === value),
        "日期须为 YYYY 或有效的 YYYY-MM-DD",
    );
const optionalTime = z
    .string()
    .refine((value) => !value || z.iso.datetime({ offset: true }).safeParse(value).success, "请使用有效且含时区的日期时间")
    .default("");
const visible = z.boolean().default(true);
const featured = z.boolean().default(false);

export const siteSchema = z.object({
    name: requiredText,
    name_ja: text,
    school: text,
    tagline: text,
    description: text,
    logo: image,
    home_image: image,
    home_caption: text,
    content_note: text,
    departments: z.array(z.object({ name: requiredText, text, image, visible })).default([]),
    contacts: z
        .array(
            z.object({
                name: requiredText,
                text,
                link: url,
                qr_link: url,
                qr_image: image,
            }),
        )
        .default([]),
});

export const historySchema = z.object({
    items: z
        .array(
            z.object({
                year: z.union([z.string(), z.number()]),
                title: requiredText,
                text,
                image,
                visible,
            }),
        )
        .default([]),
});
export const cultureSchema = z.object({
    intro: text,
    story: z.object({ title: text, text, image }).prefault({}),
    characters: z
        .array(
            z.object({
                name: requiredText,
                text,
                image,
                author: text,
                year: text,
                featured,
                visible,
            }),
        )
        .default([]),
    works: z
        .array(
            z.object({
                title: requiredText,
                text,
                image,
                author: text,
                year: text,
                link: url,
                featured,
                visible,
            }),
        )
        .default([]),
});
export const activitiesSchema = z.object({
    items: z
        .array(
            z.object({
                title: requiredText,
                date,
                summary: text,
                image,
                category: text,
                link: url,
                featured,
                visible,
            }),
        )
        .default([]),
});

export const noticeSchema = z
    .object({
        enabled: z.boolean().default(false),
        id: text,
        title: text,
        text,
        event_time: text,
        location: text,
        starts_at: optionalTime,
        ends_at: optionalTime,
    })
    .superRefine((notice, ctx) => {
        if (!notice.enabled) return;
        for (const field of ["id", "title", "event_time", "location", "starts_at", "ends_at"] as const) {
            if (!notice[field])
                ctx.addIssue({
                    code: "custom",
                    path: [field],
                    message: "启用公告前请填写此项",
                });
        }
        if (notice.starts_at && notice.ends_at && Date.parse(notice.ends_at) <= Date.parse(notice.starts_at)) {
            ctx.addIssue({
                code: "custom",
                path: ["ends_at"],
                message: "结束时间必须晚于开始时间",
            });
        }
    });

export type MarkdownHtml = string & { readonly __markdownHtml: unique symbol };
type WithMarkdown<T> = T & { textHtml: MarkdownHtml };
type RawSite = z.infer<typeof siteSchema>;
type RawCulture = z.infer<typeof cultureSchema>;

export type Notice = z.infer<typeof noticeSchema>;
export type Activity = z.infer<typeof activitiesSchema>["items"][number] & { summaryHtml: MarkdownHtml };
export type HistoryEntry = WithMarkdown<z.infer<typeof historySchema>["items"][number]>;
export type Contact = RawSite["contacts"][number] & {
    qr_size?: number;
    qr_path?: string;
};

export interface ClubContent {
    site: Omit<RawSite, "contacts" | "departments"> & {
        contacts: Contact[];
        departments: WithMarkdown<RawSite["departments"][number]>[];
    };
    history: HistoryEntry[];
    culture: Omit<RawCulture, "story" | "characters" | "works"> & {
        story: WithMarkdown<RawCulture["story"]>;
        characters: WithMarkdown<RawCulture["characters"][number]>[];
        works: WithMarkdown<RawCulture["works"][number]>[];
    };
    activities: Activity[];
    notice: Notice;
}
