<script setup lang="ts">
    import { ArrowLeft } from "@lucide/vue";
    import MagicSeal from "../components/MagicSeal.vue";
</script>

<template>
    <div class="container missing-page">
        <MagicSeal />
        <p class="eyebrow">404 / A MISSING PAGE</p>
        <h1>这一页，暂未写下。</h1>
        <p>可以回到首页，继续阅读朝之雾的故事。</p>
        <RouterLink class="button-link" to="/"><ArrowLeft aria-hidden="true" />返回首页</RouterLink>
    </div>
</template>
