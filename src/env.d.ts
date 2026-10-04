/// <reference types="vite/client" />

declare module "virtual:club-content" {
    const content: import("./content/schema").ClubContent;
    export default content;
}

interface Window {
    clubTheme: import("./theme/types").ThemeController;
}
