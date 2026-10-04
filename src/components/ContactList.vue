<script setup lang="ts">
    import { ArrowUpRight, ScanLine } from "@lucide/vue";
    import content from "virtual:club-content";

    const { contacts } = content.site;
</script>

<template>
    <ul class="contacts">
        <li v-for="contact in contacts" :key="contact.name">
            <div v-if="contact.qr_image || contact.qr_path" class="contact-qr">
                <img
                    v-if="contact.qr_image"
                    :src="contact.qr_image"
                    :alt="`${contact.name}二维码`"
                    width="136"
                    height="136"
                    loading="lazy"
                />
                <svg
                    v-else
                    :viewBox="`0 0 ${contact.qr_size} ${contact.qr_size}`"
                    role="img"
                    :aria-label="`${contact.name}二维码`"
                    shape-rendering="crispEdges"
                >
                    <path :d="contact.qr_path" fill="#1c3635" />
                </svg>
            </div>
            <div class="contact-copy">
                <p class="eyebrow">
                    <ScanLine aria-hidden="true" />
                    保持联络
                </p>
                <h3>{{ contact.name }}</h3>
                <p v-if="contact.text">{{ contact.text }}</p>
                <a
                    v-if="contact.link || contact.qr_link"
                    :href="contact.link || contact.qr_link"
                    class="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    打开链接
                    <ArrowUpRight aria-hidden="true" />
                </a>
            </div>
        </li>
    </ul>
</template>
