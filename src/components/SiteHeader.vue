<script setup lang="ts">
    import content from "virtual:club-content";
    import { navigation } from "../router";
    import ThemeControl from "./ThemeControl.vue";

    const { site } = content;
</script>

<template>
    <header class="site-header">
        <div class="container header-inner">
            <RouterLink class="brand" to="/" :aria-label="`${site.name}首页`">
                <span class="brand-emblem">
                    <img v-if="site.logo" :src="site.logo" alt="" width="44" height="44" />
                </span>
                <span class="brand-name">
                    <strong>{{ site.name }}</strong>
                    <small>ASANOKIRI · {{ site.name_ja }}</small>
                </span>
            </RouterLink>
            <nav class="primary-nav" aria-label="主导航">
                <RouterLink v-for="item in navigation" :key="item.path" :to="item.path">
                    <span class="nav-chapter" aria-hidden="true">{{ item.chapter }}</span>
                    {{ item.label }}
                </RouterLink>
            </nav>
            <ThemeControl />
        </div>
    </header>
</template>
