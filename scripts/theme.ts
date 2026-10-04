import ts from "typescript";

// 生成在 <head> 同步执行的普通脚本，不等应用模块下载完成。
export function compileThemeScript(source: string): string {
    return ts.transpileModule(source, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2022,
            module: ts.ModuleKind.None,
            moduleDetection: ts.ModuleDetectionKind.Legacy,
        },
    }).outputText;
}
