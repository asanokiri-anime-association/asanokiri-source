<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref } from "vue";
    import { CalendarDays, ChevronDown, ChevronUp, MapPin, Megaphone } from "@lucide/vue";
    import content from "virtual:club-content";
    import { isNoticeActive, noticeStorageKey } from "../lib/notice";

    // setTimeout 的最长延迟；更远的时间边界在定时器到期或回到页面时重新计算。
    const maxDelay = 2 ** 31 - 1;
    const { notice } = content;
    const now = ref(Date.now());
    const dismissed = ref(false);
    const storageKey = noticeStorageKey(notice);
    try {
        dismissed.value = localStorage.getItem(storageKey) === "closed";
    } catch {
        /* 存储不可用时，收起状态仅在当前页面内生效。 */
    }
    const active = computed(() => isNoticeActive(notice, now.value));
    let timer: ReturnType<typeof setTimeout> | undefined;

    function update() {
        now.value = Date.now();
        clearTimeout(timer);
        const boundaries = [Date.parse(notice.starts_at), Date.parse(notice.ends_at)].filter(
            (time) => time > now.value,
        );
        if (boundaries.length) timer = setTimeout(update, Math.min(Math.min(...boundaries) - now.value + 1, maxDelay));
    }
    function close() {
        dismissed.value = true;
        try {
            localStorage.setItem(storageKey, "closed");
        } catch {
            /* 页面内仍生效。 */
        }
    }
    onMounted(() => {
        update();
        document.addEventListener("visibilitychange", update);
    });
    onUnmounted(() => {
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", update);
    });
</script>

<template>
    <aside v-if="active" class="notice" aria-label="社团公告">
        <div v-if="dismissed" class="container notice-collapsed">
            <span class="notice-title">
                <Megaphone aria-hidden="true" />
                {{ notice.title }}
            </span>
            <button class="text-button" @click="dismissed = false">
                展开公告
                <ChevronDown aria-hidden="true" />
            </button>
        </div>
        <div v-else class="container notice-inner">
            <div class="notice-copy">
                <strong class="notice-title">
                    <Megaphone aria-hidden="true" />
                    {{ notice.title }}
                </strong>
                <p v-if="notice.text">{{ notice.text }}</p>
                <p class="notice-details">
                    <span>
                        <CalendarDays aria-hidden="true" />
                        时间：{{ notice.event_time }}
                    </span>
                    <span>
                        <MapPin aria-hidden="true" />
                        地点：{{ notice.location }}
                    </span>
                </p>
            </div>
            <button class="text-button" @click="close">
                收起公告
                <ChevronUp aria-hidden="true" />
            </button>
        </div>
    </aside>
</template>
