import MarkdownIt from "markdown-it";
import type { MarkdownHtml } from "../src/content/schema.ts";

const parser = new MarkdownIt({ html: false, linkify: false, typographer: false });
parser.disable("image");

const validateLink = parser.validateLink;
parser.validateLink = (url: string) =>
    validateLink(url) && (/^https:\/\//i.test(url) || /^\/(?![\\/])/.test(url) || url.startsWith("#"));

parser.renderer.rules.link_open = (tokens, index, options, _env, renderer) => {
    const token = tokens[index];
    const href = token?.attrGet("href");
    if (token && typeof href === "string" && /^https:\/\//i.test(href)) {
        token.attrSet("target", "_blank");
        token.attrSet("rel", "noopener noreferrer");
    }
    return renderer.renderToken(tokens, index, options);
};

// 内容标题从三级开始，保留页面标题和栏目标题的语义层级。
for (const rule of ["heading_open", "heading_close"]) {
    parser.renderer.rules[rule] = (tokens, index, options, _env, renderer) => {
        const token = tokens[index];
        if (token) token.tag = `h${Math.min(6, Number(token.tag.slice(1)) + 2)}`;
        return renderer.renderToken(tokens, index, options);
    };
}

export function renderMarkdown(source: string): MarkdownHtml {
    return parser.render(source) as MarkdownHtml;
}
