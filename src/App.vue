<script setup lang="ts">
    import { nextTick, watch } from "vue";
    import { useRoute } from "vue-router";
    import content from "virtual:club-content";
    import SiteHeader from "./components/SiteHeader.vue";
    import SiteFooter from "./components/SiteFooter.vue";

    const route = useRoute();
    watch(
        () => route.fullPath,
        async (path, previous) => {
            document.title = `${route.meta.title} · ${content.site.name}`;
            if (previous !== undefined && path.split("#")[0] !== previous.split("#")[0]) {
                await nextTick();
                document.getElementById("main")?.focus({ preventScroll: true });
            }
        },
        { immediate: true, flush: "post" },
    );
</script>

<template>
    <a class="skip-link" href="#main">跳到主要内容</a>
    <SiteHeader />
    <main id="main" tabindex="-1">
        <RouterView />
    </main>
    <SiteFooter />
</template>
