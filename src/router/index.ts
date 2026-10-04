import { nextTick } from "vue";
import { createRouter, createWebHistory, START_LOCATION } from "vue-router";
import content from "virtual:club-content";
import HomePage from "../pages/HomePage.vue";

export const navigation = [
    { path: "/", label: "首页", chapter: "I" },
    { path: "/about", label: "了解社团", chapter: "II" },
    { path: "/culture", label: "文化与作品", chapter: "III" },
    { path: "/activities", label: "代表活动", chapter: "IV" },
];

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: HomePage, meta: { title: "首页" } },
        {
            path: "/about",
            component: () => import("../pages/AboutPage.vue"),
            meta: { title: "了解社团" },
        },
        {
            path: "/culture",
            component: () => import("../pages/CulturePage.vue"),
            meta: { title: "文化与作品" },
        },
        {
            path: "/activities",
            component: () => import("../pages/ActivitiesPage.vue"),
            meta: { title: "代表活动" },
        },
        {
            path: "/:pathMatch(.*)*",
            component: () => import("../pages/NotFoundPage.vue"),
            meta: { title: "页面未找到" },
        },
    ],
    scrollBehavior(to, _from, savedPosition) {
        if (savedPosition) return savedPosition;
        if (to.hash) {
            const headerHeight = Number.parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
            );
            return { el: to.hash, top: headerHeight + 24 };
        }
        return { top: 0 };
    },
});

// 换页后更新标题，并把焦点移到正文，方便读屏和键盘用户；首次加载和同页锚点跳转不移动焦点。
router.afterEach(async (to, from, failure) => {
    if (failure) return;
    document.title = `${to.meta.title} · ${content.site.name}`;
    if (from !== START_LOCATION && to.path !== from.path) {
        await nextTick();
        document.getElementById("main")?.focus({ preventScroll: true });
    }
});

export default router;
