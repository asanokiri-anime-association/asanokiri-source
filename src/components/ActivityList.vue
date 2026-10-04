<script setup lang="ts">
    import { ArrowUpRight, CalendarDays } from "@lucide/vue";
    import type { Activity } from "../content/schema";
    import MarkdownContent from "./MarkdownContent.vue";

    defineProps<{ items: Activity[] }>();
</script>

<template>
    <ol class="activity-list">
        <li v-for="(item, index) in items" :key="`${item.date}-${item.title}`">
            <article class="activity-entry">
                <span class="activity-number" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
                <figure v-if="item.image" class="activity-image">
                    <img :src="item.image" :alt="item.title" loading="lazy" width="480" height="320" />
                </figure>
                <div class="activity-body">
                    <p class="eyebrow">
                        <CalendarDays aria-hidden="true" />
                        <time :datetime="item.date">{{ item.date }}</time>
                        <span v-if="item.category">/ {{ item.category }}</span>
                    </p>
                    <h3>{{ item.title }}</h3>
                    <MarkdownContent v-if="item.summaryHtml" :html="item.summaryHtml" />
                    <a v-if="item.link" class="text-link" :href="item.link" target="_blank" rel="noopener noreferrer">
                        阅读活动推文
                        <ArrowUpRight aria-hidden="true" />
                    </a>
                    <p v-else class="activity-note">历史图片留存 · 推文链接待补充</p>
                </div>
            </article>
        </li>
    </ol>
</template>
