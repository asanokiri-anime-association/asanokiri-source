export type ThemeMode = "light" | "dark" | "auto";
export type ThemeColor = Exclude<ThemeMode, "auto">;

export interface ThemeController {
    readonly preference: ThemeMode;
    set(next: ThemeMode): void;
    resolve(next: ThemeMode): ThemeColor;
}
