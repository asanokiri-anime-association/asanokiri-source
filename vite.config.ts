import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { loadContent, contentFiles } from "./scripts/content.ts";
import { compileThemeScript } from "./scripts/theme.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const contentId = "\0virtual:club-content";

export default defineConfig({
    plugins: [
        vue(),
        {
            name: "club-content",
            resolveId(id) {
                if (id === "virtual:club-content") return contentId;
            },
            load(id) {
                if (id !== contentId) return;
                for (const file of contentFiles) this.addWatchFile(root + file);
                return `export default ${JSON.stringify(loadContent(root))}`;
            },
            handleHotUpdate({ file, server }) {
                if (!file.replaceAll("\\", "/").includes("/data/")) return;
                const module = server.moduleGraph.getModuleById(contentId);
                if (module) server.moduleGraph.invalidateModule(module);
                server.ws.send({ type: "full-reload" });
                return [];
            },
            transformIndexHtml: {
                order: "pre",
                async handler(html) {
                    const source = readFileSync(root + "src/theme/bootstrap.ts", "utf8");
                    const script = await compileThemeScript(source);
                    return html.replace("<!-- theme-bootstrap -->", `<script>${script}</script>`);
                },
            },
        },
    ],
    build: { outDir: "dist" },
});
