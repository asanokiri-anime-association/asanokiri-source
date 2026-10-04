import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

export const navigation = [
    { path: "/", label: "首页" },
    { path: "/about", label: "了解社团" },
    { path: "/culture", label: "文化与作品" },
    { path: "/activities", label: "代表活动" },
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

export default router;
