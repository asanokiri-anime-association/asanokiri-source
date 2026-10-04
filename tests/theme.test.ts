import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { compileThemeScript } from "../scripts/theme.ts";
import type { ThemeController } from "../src/theme/types.ts";

const source = await compileThemeScript(readFileSync(new URL("../src/theme/bootstrap.ts", import.meta.url), "utf8"));

function start({ dark = false, saved, blocked = false }: { dark?: boolean; saved?: string; blocked?: boolean } = {}) {
    const storage = new Map<string, string>();
    if (saved !== undefined) storage.set("asanokiri-theme", saved);
    const system = Object.assign(new EventTarget(), { matches: dark });
    const window: EventTarget & {
        matchMedia: () => typeof system;
        clubTheme?: ThemeController;
    } = Object.assign(new EventTarget(), { matchMedia: () => system });
    const html: {
        dataset: Record<string, string>;
        style: Record<string, string>;
    } = {
        dataset: {},
        style: {},
    };
    let themeColor: string | undefined;
    runInNewContext(source, {
        window,
        Event,
        document: {
            documentElement: html,
            querySelector: () => ({
                setAttribute: (_name: string, value: string) => {
                    themeColor = value;
                },
            }),
        },
        localStorage: {
            getItem: (key: string) => {
                if (blocked) throw new Error("storage disabled");
                return storage.get(key) ?? null;
            },
            setItem: (key: string, value: string) => {
                if (blocked) throw new Error("storage disabled");
                storage.set(key, value);
            },
        },
    });
    assert.ok(window.clubTheme);
    return {
        html,
        storage,
        window,
        controller: window.clubTheme,
        get themeColor() {
            return themeColor;
        },
        changeSystem(next: boolean) {
            system.matches = next;
            system.dispatchEvent(new Event("change"));
        },
    };
}

test("首次访问在 Vue 启动前应用系统深色与浏览器背景色", () => {
    const page = start({ dark: true });
    assert.equal(page.html.dataset.theme, "dark");
    assert.equal(page.html.dataset.themeMode, "auto");
    assert.equal(page.html.style.colorScheme, "dark");
    assert.equal(page.themeColor, "#122b2c");
});

test("记住的选择优先于系统设置，非法选择退回系统", () => {
    assert.equal(start({ dark: false, saved: "dark" }).html.dataset.theme, "dark");
    assert.equal(start({ dark: true, saved: "light" }).html.dataset.theme, "light");
    assert.equal(start({ dark: true, saved: "invalid" }).html.dataset.themeMode, "auto");
});

test("明确选择与系统相同的颜色后，系统变化也不会覆盖该选择", () => {
    const page = start();
    page.controller.set("light");
    page.changeSystem(true);
    assert.equal(page.html.dataset.theme, "light");
    assert.equal(page.storage.get("asanokiri-theme"), "light");
    page.controller.set("auto");
    assert.equal(page.html.dataset.theme, "dark");
    page.changeSystem(false);
    assert.equal(page.html.dataset.theme, "light");
});

test("禁用存储仍可渲染深色并切换主题", () => {
    const page = start({ blocked: true, dark: true });
    assert.equal(page.html.dataset.theme, "dark");
    page.controller.set("light");
    assert.equal(page.html.dataset.theme, "light");
});

test("跨标签页同步设置，清除设置后恢复跟随系统", () => {
    const page = start({ saved: "light", dark: true });
    const update = new Event("storage");
    Object.assign(update, { key: "asanokiri-theme", newValue: "dark" });
    page.window.dispatchEvent(update);
    assert.equal(page.html.dataset.theme, "dark");
    const clear = new Event("storage");
    Object.assign(clear, { key: null, newValue: null });
    page.window.dispatchEvent(clear);
    assert.equal(page.html.dataset.themeMode, "auto");
});
