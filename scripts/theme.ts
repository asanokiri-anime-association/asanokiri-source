import { transformWithOxc } from "vite";

// 去除类型，得到在 <head> 中同步执行的普通脚本，不等应用模块下载完成。
export async function compileThemeScript(source: string): Promise<string> {
    const { code } = await transformWithOxc(source, "bootstrap.ts", { lang: "ts" });
    return code;
}
