<script setup lang="ts">
    import { BookOpen, Compass, Send } from "@lucide/vue";
    import content from "virtual:club-content";
    import ContactList from "../components/ContactList.vue";
    import HistoryTimeline from "../components/HistoryTimeline.vue";
    import MarkdownContent from "../components/MarkdownContent.vue";
    import MagicSeal from "../components/MagicSeal.vue";
    const { site, history } = content;
</script>

<template>
    <div class="container">
        <header class="page-intro">
            <div>
                <p class="eyebrow">
                    <Compass aria-hidden="true" />
                    CHAPTER II / 了解社团
                </p>
                <h1>
                    在这里，
                    <em>找到同路人。</em>
                </h1>
                <p class="page-lead">{{ site.description }}</p>
            </div>
            <MagicSeal class="page-seal" />
        </header>
        <p v-if="site.content_note" class="content-note">{{ site.content_note }}</p>
        <section v-if="site.departments.length" class="section" aria-labelledby="departments-heading">
            <header class="section-heading">
                <div>
                    <p class="eyebrow">
                        <BookOpen aria-hidden="true" />
                        THE DEPARTMENTS
                    </p>
                    <h2 id="departments-heading">
                        各有所长，
                        <em>一起同行。</em>
                    </h2>
                </div>
                <span class="section-aside">
                    {{ String(site.departments.length).padStart(2, "0") }} 个部门 · 一个朝之雾
                </span>
            </header>
            <div class="department-list">
                <article
                    v-for="(department, index) in site.departments"
                    :id="`department-${index}`"
                    :key="department.name"
                    class="department"
                >
                    <div class="department-name">
                        <span class="index-number">{{ String(index + 1).padStart(2, "0") }}</span>
                        <h3>{{ department.name }}</h3>
                    </div>
                    <div class="department-detail">
                        <MarkdownContent :html="department.textHtml" />
                        <img v-if="department.image" :src="department.image" :alt="department.name" loading="lazy" />
                    </div>
                </article>
            </div>
        </section>
    </div>
    <HistoryTimeline id="history" :items="history" />
    <section v-if="site.contacts.length" id="contacts" class="container section" aria-labelledby="contacts-heading">
        <header class="section-heading">
            <div>
                <p class="eyebrow">
                    <Send aria-hidden="true" />
                    LETTERS & CONNECTIONS
                </p>
                <h2 id="contacts-heading">
                    下一次相遇，
                    <em>从这里开始。</em>
                </h2>
            </div>
        </header>
        <ContactList />
    </section>
</template>
