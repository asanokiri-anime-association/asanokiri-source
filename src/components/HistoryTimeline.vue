<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch } from "vue";
    import { ArrowDown, BookOpen, ChevronRight } from "@lucide/vue";
    import type { HistoryEntry } from "../content/schema";
    import { chapterAtRail, railPosition, scrollProgress, scrollTopAtChapter, segmentFill } from "../lib/chronicle";
    import MarkdownContent from "./MarkdownContent.vue";
    import MagicSeal from "./MagicSeal.vue";

    const props = defineProps<{ items: HistoryEntry[]; id: string }>();
    const track = ref<HTMLElement>();
    const stage = ref<HTMLElement>();
    const nav = ref<HTMLElement>();
    const pinned = ref(false);
    const progress = ref(0);
    // 节点在连接线到达时点亮，当前章节即最后一个到达的节点。
    const rail = computed(() => railPosition(progress.value, props.items.length));
    const active = computed(() => chapterAtRail(rail.value, props.items.length));
    let media: MediaQueryList | undefined;
    let observer: ResizeObserver | undefined;
    let frame = 0;

    // 舞台在轨道内容区内固定，进度从舞台贴住页眉开始，到舞台底部触及轨道内容区底部结束。
    function geometry() {
        if (!track.value || !stage.value) return { start: 0, distance: 0 };
        const inset = Number.parseFloat(getComputedStyle(stage.value).top) || 0;
        return {
            start: window.scrollY + track.value.getBoundingClientRect().top + track.value.clientTop - inset,
            distance: track.value.clientHeight - stage.value.offsetHeight,
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
        if (!pinned.value) progress.value = 0;
        schedule();
    }
    // 在一个方向上使 [start, start + size] 进入可见区域所需的最小滚动位置；已可见时保持原位。
    function nearestScroll(start: number, size: number, scroll: number, view: number) {
        if (start < scroll) return start;
        if (start + size > scroll + view) return start + size - view;
        return scroll;
    }
    // 年份较多时导航在内部滚动。只滚动导航自身，且仅在当前年份不可见时移动，不打断访客对导航的滚动。
    function revealCurrent() {
        const box = nav.value;
        const item = box?.querySelector("ol")?.children[active.value];
        if (!pinned.value || !box || !(item instanceof HTMLElement)) return;
        const left = nearestScroll(item.offsetLeft, item.offsetWidth, box.scrollLeft, box.clientWidth);
        const top = nearestScroll(item.offsetTop, item.offsetHeight, box.scrollTop, box.clientHeight);
        if (left !== box.scrollLeft || top !== box.scrollTop) box.scrollTo({ left, top, behavior: "smooth" });
    }
    function resize() {
        schedule();
        revealCurrent();
    }
    function jump(index: number) {
        if (pinned.value) {
            const { start, distance } = geometry();
            window.scrollTo({
                top: scrollTopAtChapter(index, props.items.length, start, distance, window.devicePixelRatio),
                behavior: "smooth",
            });
        } else {
            document.getElementById(`${props.id}-entry-${index}`)?.scrollIntoView({ block: "start" });
        }
    }

    watch([active, pinned], revealCurrent, { flush: "post" });
    onMounted(() => {
        media = window.matchMedia("(prefers-reduced-motion: no-preference)");
        media.addEventListener("change", syncMode);
        window.addEventListener("scroll", schedule, { passive: true });
        observer = new ResizeObserver(resize);
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
                        <h2 :id="`${id}-title`">时光成卷，<em>热爱不息。</em></h2>
                    </div>
                    <p class="section-aside">
                        <span class="chronicle-count">
                            {{ String(active + 1).padStart(2, "0") }} / {{ String(items.length).padStart(2, "0") }}
                        </span>
                        <span v-if="pinned" class="scroll-cue">向下阅读<ArrowDown aria-hidden="true" /></span>
                    </p>
                </header>

                <div class="chronicle-layout">
                    <nav ref="nav" class="chronicle-index" aria-label="历程年份">
                        <ol>
                            <li v-for="(item, index) in items" :key="`${item.year}-${item.title}`">
                                <span
                                    class="chronicle-rail"
                                    :class="{ 'chronicle-rail--tail': index === items.length - 1 }"
                                    aria-hidden="true"
                                >
                                    <span :style="{ '--segment-progress': segmentFill(rail, index, items.length) }"></span>
                                </span>
                                <button
                                    :class="{
                                        'is-reached': pinned && index <= active,
                                        'is-current': pinned && index === active,
                                    }"
                                    :aria-current="pinned && index === active ? 'step' : undefined"
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
                                    <span>ASANOKIRI<br />{{ item.year }}</span>
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
