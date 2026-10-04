<script setup lang="ts">
    import { onMounted, onUnmounted, ref, type Component } from "vue";
    import { Sun, Monitor, Moon } from "@lucide/vue";
    import type { ThemeMode } from "../theme/types";

    const modes: { value: ThemeMode; label: string; icon: Component }[] = [
        { value: "light", label: "浅色", icon: Sun },
        { value: "auto", label: "跟随系统", icon: Monitor },
        { value: "dark", label: "深色", icon: Moon },
    ];
    const mode = ref(window.clubTheme.preference);
    let transition: ViewTransition | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let request = 0;

    function sync() {
        mode.value = window.clubTheme.preference;
    }
    async function choose(next: ThemeMode) {
        if (next === mode.value) return;
        const currentRequest = ++request;
        mode.value = next;
        transition?.skipTransition();
        const changed = window.clubTheme.resolve(next) !== document.documentElement.dataset.theme;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const apply = () => {
            if (currentRequest === request) window.clubTheme.set(next);
        };
        if (!changed || reduced) {
            apply();
            return;
        }
        if (document.startViewTransition) {
            transition = document.startViewTransition(apply);
            await transition.finished.catch(() => {});
        } else {
            clearTimeout(fallbackTimer);
            document.documentElement.classList.add("theme-fallback");
            apply();
            fallbackTimer = setTimeout(() => document.documentElement.classList.remove("theme-fallback"), 400);
        }
    }

    onMounted(() => window.addEventListener("club-theme-change", sync));
    onUnmounted(() => {
        window.removeEventListener("club-theme-change", sync);
        clearTimeout(fallbackTimer);
        transition?.skipTransition();
        document.documentElement.classList.remove("theme-fallback");
    });
</script>

<template>
    <fieldset class="theme-control">
        <legend class="sr-only">页面主题</legend>
        <label
            v-for="option in modes"
            :key="option.value"
            :class="{ selected: mode === option.value }"
            :title="option.label"
        >
            <input
                type="radio"
                name="theme"
                :value="option.value"
                :checked="mode === option.value"
                @change="choose(option.value)"
            />
            <component :is="option.icon" aria-hidden="true" />
            <span class="sr-only">{{ option.label }}</span>
        </label>
    </fieldset>
</template>
