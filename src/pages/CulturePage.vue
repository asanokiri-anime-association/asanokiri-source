<script setup lang="ts">
    import { ArrowUpRight, BookOpen, Feather, Sparkles } from "@lucide/vue";
    import content from "virtual:club-content";
    import MarkdownContent from "../components/MarkdownContent.vue";
    import MagicSeal from "../components/MagicSeal.vue";
    const { culture } = content;
</script>

<template>
    <div class="container">
        <header class="page-intro">
            <div>
                <p class="eyebrow">
                    <Feather aria-hidden="true" />
                    CHAPTER III / 文化与作品
                </p>
                <h1>
                    想象的世界，
                    <em>由我们书写。</em>
                </h1>
                <p class="page-lead">{{ culture.intro }}</p>
            </div>
            <MagicSeal class="page-seal" />
        </header>
        <section v-if="culture.story.title" class="story-section" aria-labelledby="story-heading">
            <figure v-if="culture.story.image" class="story-banner">
                <img :src="culture.story.image" :alt="culture.story.title" width="1900" height="190" />
            </figure>
            <div class="story-layout">
                <header>
                    <p class="eyebrow">
                        <BookOpen aria-hidden="true" />
                        THE PROLOGUE
                    </p>
                    <h2 id="story-heading">{{ culture.story.title }}</h2>
                    <p class="story-side-note">
                        每一个世界，
                        <br />
                        都始于某个人的想象。
                    </p>
                </header>
                <MarkdownContent :html="culture.story.textHtml" />
            </div>
        </section>

        <section v-if="culture.characters.length" class="section" aria-labelledby="characters-heading">
            <header class="section-heading">
                <div>
                    <p class="eyebrow">
                        <Sparkles aria-hidden="true" />
                        THE CHARACTERS
                    </p>
                    <h2 id="characters-heading">
                        故事里的
                        <em>伙伴们。</em>
                    </h2>
                </div>
                <span class="section-aside">角色设定与社团记忆</span>
            </header>
            <div class="characters">
                <article v-for="(character, index) in culture.characters" :key="character.name" class="character">
                    <div class="portrait-plate">
                        <span class="portrait-number" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
                        <img
                            v-if="character.image"
                            :src="character.image"
                            :alt="`${character.name}角色设定图`"
                            loading="lazy"
                            width="420"
                            height="520"
                        />
                    </div>
                    <div class="character-text">
                        <p class="eyebrow">CHARACTER ARCHIVE</p>
                        <h3>{{ character.name }}</h3>
                        <p v-if="character.author || character.year" class="creator-credit">
                            {{ [character.author, character.year].filter(Boolean).join(" · ") }}
                        </p>
                        <MarkdownContent :html="character.textHtml" />
                    </div>
                </article>
            </div>
        </section>

        <section v-if="culture.works.length" class="section" aria-labelledby="works-heading">
            <header class="section-heading">
                <div>
                    <p class="eyebrow">
                        <Feather aria-hidden="true" />
                        THE COLLECTION
                    </p>
                    <h2 id="works-heading">
                        把热爱，
                        <em>变成作品。</em>
                    </h2>
                </div>
            </header>
            <div class="works">
                <article v-for="work in culture.works" :key="work.title">
                    <figure v-if="work.image" class="work-image">
                        <img :src="work.image" :alt="work.title" loading="lazy" />
                    </figure>
                    <h3>{{ work.title }}</h3>
                    <p v-if="work.author || work.year" class="creator-credit">
                        {{ [work.author, work.year].filter(Boolean).join(" · ") }}
                    </p>
                    <MarkdownContent :html="work.textHtml" />
                    <a v-if="work.link" class="text-link" :href="work.link" target="_blank" rel="noopener noreferrer">
                        查看作品
                        <ArrowUpRight aria-hidden="true" />
                    </a>
                </article>
            </div>
        </section>
    </div>
</template>
