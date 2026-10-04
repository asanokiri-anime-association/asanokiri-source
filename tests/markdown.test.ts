import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "../scripts/markdown.ts";

test("CMS 正文支持段落、强调、列表、引用和不抢占页面层级的标题", () => {
    const html = renderMarkdown("# 社团物语\n\n**角色**与*故事*。\n\n- 创作\n- 分享\n\n> 欢迎来到朝之雾");
    assert.match(html, /<h3>社团物语<\/h3>/);
    assert.match(html, /<strong>角色<\/strong>/);
    assert.match(html, /<em>故事<\/em>/);
    assert.match(html, /<ul>[\s\S]*<li>分享<\/li>/);
    assert.match(html, /<blockquote>/);
});

test("外链有独立窗口保护，站内链接和锚点保持当前窗口", () => {
    const html = renderMarkdown("[作品](https://example.com/work) [社团](/about) [角色](#characters-heading)");
    assert.match(html, /href="https:\/\/example.com\/work" target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /<a href="\/about">社团<\/a>/);
    assert.match(html, /<a href="#characters-heading">角色<\/a>/);
});

test("HTML、脚本地址、非 HTTPS 外链与正文图片不会变为可执行内容", () => {
    const html = renderMarkdown(
        "<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[脚本](javascript:alert%281%29) [混合](jav&#x61;script:alert%281%29) [文件](data:text/html,test) [未加密](http://example.com) [隐式](//example.com)\n\n![图片](https://example.com/image.png)",
    );
    assert.doesNotMatch(html, /<script|<img|href="(?:javascript:|data:|http:|\/\/)/i);
    assert.match(html, /&lt;script&gt;/);
    assert.equal(renderMarkdown(""), "");
});
