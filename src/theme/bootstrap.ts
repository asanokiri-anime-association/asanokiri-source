// 此文件以普通脚本内联到 <head>，也是后续主题切换唯一的状态来源。
type ThemeMode = import("./types").ThemeMode;
(() => {
    const key = "asanokiri-theme";
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    let preference: ThemeMode = "auto";

    function isMode(value: unknown): value is ThemeMode {
        return value === "light" || value === "dark" || value === "auto";
    }

    try {
        const saved = localStorage.getItem(key);
        if (isMode(saved)) preference = saved;
    } catch {
        /* 禁用存储时仍能跟随系统。 */
    }

    function apply() {
        const theme = preference === "auto" ? (system.matches ? "dark" : "light") : preference;
        const html = document.documentElement;
        html.dataset.theme = theme;
        html.dataset.themeMode = preference;
        html.style.colorScheme = theme;
        document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", theme === "dark" ? "#122b2c" : "#f4f0e5");
        window.dispatchEvent(new Event("club-theme-change"));
    }

    window.clubTheme = {
        get preference() {
            return preference;
        },
        set(next: ThemeMode) {
            if (!isMode(next)) return;
            preference = next;
            try {
                localStorage.setItem(key, next);
            } catch {
                /* 存储不可用时，偏好仍在页面内生效。 */
            }
            apply();
        },
        resolve(next: ThemeMode) {
            return next === "auto" ? (system.matches ? "dark" : "light") : next;
        },
    };

    system.addEventListener("change", () => {
        if (preference === "auto") apply();
    });
    window.addEventListener("storage", (event) => {
        if (event.key !== key && event.key !== null) return;
        preference = isMode(event.newValue) ? event.newValue : "auto";
        apply();
    });
    apply();
})();
