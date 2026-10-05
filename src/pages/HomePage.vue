<script setup lang="ts">
    import type { Component } from "vue";
    import {
        ArrowDown,
        ArrowRight,
        ArrowUpRight,
        BookOpen,
        Clapperboard,
        Compass,
        Feather,
        KeyRound,
        Theater,
    } from "@lucide/vue";
    import content from "virtual:club-content";
    import NoticeBanner from "../components/NoticeBanner.vue";
    import HistoryTimeline from "../components/HistoryTimeline.vue";
    import MagicSeal from "../components/MagicSeal.vue";
    import ActivityList from "../components/ActivityList.vue";

    const { site, history, culture, activities } = content;
    // 按部门名称选择图标，未列出的部门使用 BookOpen。
    const departmentIcons: Record<string, Component> = {
        主席团: Compass,
        COS部: Theater,
        动漫部落: BookOpen,
        宣传部: Feather,
        宅务部: KeyRound,
        映像研究部: Clapperboard,
    };
    const featuredCharacters = culture.characters.filter((item) => item.featured).slice(0, 2);
    const featuredWorks = culture.works.filter((item) => item.featured).slice(0, 2);
    const featuredActivities = activities.filter((item) => item.featured).slice(0, 3);
</script>

<template>
    <NoticeBanner />
    <section class="home-hero" aria-labelledby="home-title">
        <img class="hero-landscape" src="/art/mist-academy.png" alt="" width="1902" height="827" fetchpriority="high" />
        <div class="hero-wash" aria-hidden="true"></div>
        <div class="hero-border" aria-hidden="true"></div>
        <div class="container hero-content">
            <p class="hero-kicker">
                <span class="small-rule"></span>ASANOKIRI ANIME ASSOCIATION
            </p>
            <p class="hero-japanese" lang="ja">物語は、ここから。</p>
            <h1 id="home-title">{{ site.name }}</h1>
            <p class="hero-tagline">{{ site.tagline }}</p>
            <p class="hero-school">
                {{ site.school }}
                <span class="small-diamond" aria-hidden="true"></span>
                始于 {{ history[0]?.year || "热爱" }}
            </p>
            <RouterLink class="button-link" to="/about">
                翻开我们的故事<ArrowRight aria-hidden="true" />
            </RouterLink>
        </div>
        <div class="hero-margin-note" aria-hidden="true">
            <span>雾起之处，同好相逢。</span>
            <span>VOL. 01 — THE BEGINNING</span>
        </div>
        <div class="container hero-bottom">
            <a href="#club-chapters" class="scroll-cue">
                <ArrowDown aria-hidden="true" />向下翻阅
            </a>
            <span>AN INVITATION TO OUR WORLD</span>
            <span class="hero-page-number">01 / 04</span>
        </div>
    </section>

    <section id="club-chapters" class="container section home-club" aria-labelledby="club-heading">
        <header class="section-heading">
            <div>
                <p class="eyebrow">
                    <Compass aria-hidden="true" />
                    THE GUILD / 关于社团
                </p>
                <h2 id="club-heading">
                    以热爱为名，
                    <br />
                    <em>在这里结伴。</em>
                </h2>
            </div>
            <div class="section-introduction">
                <p>{{ site.description }}</p>
                <RouterLink class="text-link" to="/about">
                    认识朝之雾
                    <ArrowUpRight aria-hidden="true" />
                </RouterLink>
            </div>
        </header>
        <ul class="department-index">
            <li v-for="(department, index) in site.departments" :key="department.name">
                <RouterLink :to="`/about#department-${index}`">
                    <span class="department-icon">
                        <component :is="departmentIcons[department.name] || BookOpen" aria-hidden="true" />
                    </span>
                    <span class="department-label">
                        <small>DEPARTMENT {{ String(index + 1).padStart(2, "0") }}</small>
                        <strong>{{ department.name }}</strong>
                    </span>
                    <ArrowUpRight class="department-arrow" aria-hidden="true" />
                </RouterLink>
            </li>
        </ul>
        <p v-if="site.content_note" class="content-note">{{ site.content_note }}</p>
    </section>

    <HistoryTimeline id="history" :items="history" />

    <section
        v-if="culture.characters.length || culture.works.length || culture.story.title"
        class="container section home-culture"
        aria-labelledby="culture-heading"
    >
        <header class="section-heading">
            <div>
                <p class="eyebrow">
                    <Feather aria-hidden="true" />
                    OUR IMAGINATION / 文化与作品
                </p>
                <h2 id="culture-heading">
                    让想象，
                    <em>拥有名字。</em>
                </h2>
            </div>
            <RouterLink class="text-link" to="/culture">
                走进文化与作品
                <ArrowUpRight aria-hidden="true" />
            </RouterLink>
        </header>
        <div class="culture-feature">
            <figure class="culture-illustration">
                <img
                    v-if="site.home_image"
                    :src="site.home_image"
                    :alt="site.home_caption || culture.story.title"
                    loading="lazy"
                    width="824"
                    height="640"
                />
                <figcaption v-if="site.home_caption">{{ site.home_caption }}</figcaption>
            </figure>
            <div class="culture-feature-copy">
                <MagicSeal class="culture-seal" />
                <p class="eyebrow">TALES OF ASANOKIRI</p>
                <h3>{{ culture.story.title || "我们的创作" }}</h3>
                <p>{{ culture.intro }}</p>
                <RouterLink class="button-link button-link--outline" to="/culture">
                    打开故事之书
                    <BookOpen aria-hidden="true" />
                </RouterLink>
                <ul v-if="featuredCharacters.length" class="character-index">
                    <li v-for="character in featuredCharacters" :key="character.name">
                        <RouterLink to="/culture#characters-heading">
                            <span>{{ character.name }}</span>
                            <ArrowUpRight aria-hidden="true" />
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
        <ul v-if="featuredWorks.length" class="home-works">
            <li v-for="work in featuredWorks" :key="work.title">
                <RouterLink to="/culture#works-heading">
                    <img v-if="work.image" :src="work.image" :alt="work.title" loading="lazy" />
                    <span>
                        {{ work.title }}
                        <ArrowUpRight aria-hidden="true" />
                    </span>
                </RouterLink>
            </li>
        </ul>
    </section>

    <section
        v-if="featuredActivities.length"
        class="container section home-activities"
        aria-labelledby="activities-heading"
    >
        <header class="section-heading">
            <div>
                <p class="eyebrow">
                    <Clapperboard aria-hidden="true" />
                    FIELD NOTES / 代表活动
                </p>
                <h2 id="activities-heading">
                    把相遇，
                    <em>留在这一页。</em>
                </h2>
            </div>
            <RouterLink class="text-link" to="/activities">
                全部活动记录
                <ArrowUpRight aria-hidden="true" />
            </RouterLink>
        </header>
        <ActivityList :items="featuredActivities" />
    </section>
</template>
