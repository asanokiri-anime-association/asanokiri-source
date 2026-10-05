<script setup lang="ts">
    import { ArrowUpRight, Feather } from "@lucide/vue";
    import content from "virtual:club-content";
    import MagicSeal from "./MagicSeal.vue";

    const { site } = content;
</script>

<template>
    <footer class="site-footer">
        <div class="container footer-main">
            <div class="footer-signature">
                <MagicSeal variant="mark" />
                <div>
                    <p class="eyebrow">THE NEXT CHAPTER IS OURS</p>
                    <strong>{{ site.name }}</strong>
                    <p>{{ site.school }} · あさのきり</p>
                </div>
            </div>
            <div class="footer-invitation">
                <p>故事还在继续。<br />下一页，期待与你相遇。</p>
                <RouterLink class="text-link" to="/about#contacts">找到我们<ArrowUpRight aria-hidden="true" /></RouterLink>
            </div>
            <nav class="footer-links" aria-label="公开渠道">
                <a
                    v-for="contact in site.contacts.filter((item) => item.link || item.qr_link)"
                    :key="contact.name"
                    :href="contact.link || contact.qr_link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ contact.name }}<ArrowUpRight aria-hidden="true" />
                </a>
            </nav>
        </div>
        <div class="container footer-bottom">
            <span>© {{ new Date().getFullYear() }} {{ site.name }}</span>
            <span><Feather aria-hidden="true" />网站由映像研究部维护</span>
            <span>WITH STORIES, WITH YOU.</span>
        </div>
    </footer>
</template>
