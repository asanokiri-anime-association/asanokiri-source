<script setup lang="ts">
    import SiteHeader from "./components/SiteHeader.vue";
    import SiteFooter from "./components/SiteFooter.vue";
</script>

<template>
    <a class="skip-link" href="#main">跳到主要内容</a>
    <SiteHeader />
    <main id="main" tabindex="-1">
        <RouterView />
    </main>
    <SiteFooter />
</template>
