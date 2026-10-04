import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@fontsource-variable/noto-serif-sc";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/chronicle.css";
import "./styles/pages.css";

createApp(App).use(router).mount("#app");
