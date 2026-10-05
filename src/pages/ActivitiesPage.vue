<script setup lang="ts">
    import { Clapperboard } from "@lucide/vue";
    import content from "virtual:club-content";
    import MagicSeal from "../components/MagicSeal.vue";
    import ActivityList from "../components/ActivityList.vue";

    const { activities } = content;
</script>

<template>
    <div class="container">
        <header class="page-intro">
            <div>
                <p class="eyebrow"><Clapperboard aria-hidden="true" />CHAPTER IV / 代表活动</p>
                <h1>一起经历，<em>一起记得。</em></h1>
                <p class="page-lead">
                    从纳新时的初次相遇，到舞台与镜头里的共同记忆。这里收录代表活动与历史影像，完整记录通过微信公众号发布。
                </p>
            </div>
            <MagicSeal class="page-seal" />
        </header>
        <section v-if="activities.length" aria-label="活动记录"><ActivityList :items="activities" /></section>
        <p v-else class="empty-state">活动记录正在整理中，欢迎关注社团微信公众号。</p>
    </div>
</template>
