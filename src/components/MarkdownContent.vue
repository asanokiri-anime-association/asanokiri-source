<script setup lang="ts">
    import type { MarkdownHtml } from "../content/schema";
    defineProps<{ html: MarkdownHtml }>();
</script>

<template>
    <div class="prose" v-html="html"></div>
</template>
