<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from "vue";
    import { ArrowDown, BookOpen, ChevronRight } from "@lucide/vue";
    import type { HistoryEntry } from "../content/schema";
    import { chapterAtProgress, chapterSegmentProgress, progressAtChapter, scrollProgress } from "../lib/chronicle";
    import MagicSeal from "./MagicSeal.vue";
    import MarkdownContent from "./MarkdownContent.vue";

    const props = defineProps<{ items: HistoryEntry[]; id: string }>();
    const track = ref<HTMLElement>();
    const stage = ref<HTMLElement>();
    const pinned = ref(false);
    const progress = ref(0);
    const active = computed(() => chapterAtProgress(progress.value, props.items.length));
    let media: MediaQueryList | undefined;
    let observer: ResizeObserver | undefined;
    let frame = 0;

    function geometry() {
        if (!track.value || !stage.value) return { start: 0, distance: 0 };
        const inset = Number.parseFloat(getComputedStyle(stage.value).top) || 0;
        return {
            start: window.scrollY + track.value.getBoundingClientRect().top - inset,
            distance: track.value.offsetHeight - stage.value.offsetHeight,
        };
    }
    function update() {
        frame = 0;
        if (!pinned.value) return;
        const { start, distance } = geometry();
        progress.value = scrollProgress(window.scrollY, start, distance);
    }
    function schedule() {
        if (!frame) frame = requestAnimationFrame(update);
    }
    function syncMode() {
        pinned.value = Boolean(media?.matches) && props.items.length > 1;
        schedule();
    }
    function jump(index: number) {
        if (pinned.value) {
            const { start, distance } = geometry();
            window.scrollTo({
                top: start + progressAtChapter(index, props.items.length) * distance,
                behavior: "smooth",
            });
        } else {
            document.getElementById(`${props.id}-entry-${index}`)?.scrollIntoView({ block: "start" });
        }
    }

    onMounted(() => {
        media = window.matchMedia("(prefers-reduced-motion: no-preference)");
        media.addEventListener("change", syncMode);
        window.addEventListener("scroll", schedule, { passive: true });
        observer = new ResizeObserver(schedule);
        if (track.value) observer.observe(track.value);
        if (stage.value) observer.observe(stage.value);
        syncMode();
    });
    onUnmounted(() => {
        media?.removeEventListener("change", syncMode);
        window.removeEventListener("scroll", schedule);
        observer?.disconnect();
        cancelAnimationFrame(frame);
    });
</script>

<template>
    <section
        v-if="items.length"
        :id="id"
        ref="track"
        class="chronicle"
        :class="{ 'chronicle--pinned': pinned }"
        :style="{ '--chapter-count': items.length }"
        :aria-labelledby="`${id}-title`"
    >
        <div ref="stage" class="chronicle-stage">
            <div class="container">
                <header class="section-heading chronicle-heading">
                    <div>
                        <p class="eyebrow">
                            <BookOpen aria-hidden="true" />
                            <span class="chronicle-kicker">THE CHRONICLE /</span>
                            <span>社团发展历程</span>
                        </p>
                        <h2 :id="`${id}-title`">
                            时光成卷，
                            <em>热爱不息。</em>
                        </h2>
                    </div>
                    <p class="section-aside">
                        <span class="chronicle-count">
                            {{ String(active + 1).padStart(2, "0") }} / {{ String(items.length).padStart(2, "0") }}
                        </span>
                        <span v-if="pinned" class="scroll-cue">
                            向下阅读
                            <ArrowDown aria-hidden="true" />
                        </span>
                    </p>
                </header>

                <div class="chronicle-layout">
                    <nav class="chronicle-index" aria-label="历程年份">
                        <ol>
                            <li v-for="(item, index) in items" :key="`${item.year}-${item.title}`">
                                <span v-if="index < items.length - 1" class="chronicle-rail" aria-hidden="true">
                                    <span
                                        :style="{
                                            '--segment-progress': chapterSegmentProgress(progress, index, items.length),
                                        }"
                                    ></span>
                                </span>
                                <button
                                    :class="{ 'is-current': index === active }"
                                    :aria-current="index === active ? 'step' : undefined"
                                    :aria-label="`${item.year} ${item.title}`"
                                    @click="jump(index)"
                                >
                                    <span class="chronicle-dot" aria-hidden="true"></span>
                                    <span class="chronicle-nav-year">{{ item.year }}</span>
                                    <span class="chronicle-nav-title">{{ item.title }}</span>
                                    <ChevronRight aria-hidden="true" />
                                </button>
                            </li>
                        </ol>
                    </nav>

                    <div class="chronicle-spreads">
                        <article
                            v-for="(item, index) in items"
                            :id="`${id}-entry-${index}`"
                            :key="`${item.year}-${item.title}`"
                            class="chronicle-entry"
                            :class="{ 'is-active': index === active }"
                            :aria-hidden="pinned && index !== active ? true : undefined"
                            :inert="pinned && index !== active"
                        >
                            <div class="chronicle-entry-copy">
                                <p class="chronicle-year">{{ item.year }}</p>
                                <p class="eyebrow">CHAPTER {{ String(index + 1).padStart(2, "0") }}</p>
                                <h3>{{ item.title }}</h3>
                                <MarkdownContent v-if="item.textHtml" :html="item.textHtml" />
                            </div>
                            <figure class="chronicle-art" :class="{ 'chronicle-art--seal': !item.image }">
                                <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" />
                                <template v-else>
                                    <MagicSeal />
                                    <span>
                                        ASANOKIRI
                                        <br />
                                        {{ item.year }}
                                    </span>
                                </template>
                                <figcaption>{{ item.image ? "旧版资料配图" : "朝之雾 · 社团编年" }}</figcaption>
                            </figure>
                        </article>
                    </div>
                </div>
                <div class="chronicle-bottom" aria-hidden="true">
                    <span>THE STORY CONTINUES</span>
                    <span class="rule"></span>
                    <span>朝之雾 / {{ items[0]?.year }} — 至今</span>
                </div>
            </div>
        </div>
    </section>
</template>
