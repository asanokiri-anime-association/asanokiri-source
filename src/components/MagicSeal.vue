<script setup lang="ts">
    withDefaults(defineProps<{ variant?: "full" | "mark" }>(), { variant: "full" });
</script>

<template>
    <svg class="magic-seal" viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <g stroke="currentColor" stroke-width="1">
            <circle cx="200" cy="200" r="178" />
            <circle cx="200" cy="200" r="164" stroke-dasharray="1 11" />
            <circle cx="200" cy="200" r="148" />
            <ellipse v-if="variant === 'full'" cx="200" cy="200" rx="106" ry="164" transform="rotate(38 200 200)" />
            <ellipse v-if="variant === 'full'" cx="200" cy="200" rx="106" ry="164" transform="rotate(-38 200 200)" />
            <path d="M200 22v35m0 286v35M22 200h35m286 0h35M74 74l24 24m204 204 24 24M74 326l24-24M302 98l24-24" />
            <path d="M200 64 228 172 336 200 228 228 200 336 172 228 64 200 172 172Z" />
            <path d="m200 134 66 66-66 66-66-66Z" />
            <circle cx="200" cy="200" r="36" />
            <circle cx="200" cy="200" r="10" />
            <path d="M182 78c7 4 29 4 36 0M78 182c4 7 4 29 0 36M182 322c7-4 29-4 36 0M322 182c-4 7-4 29 0 36" />
        </g>
        <g fill="currentColor">
            <path d="m200 13 4 8-4 8-4-8Zm187 187-8 4-8-4 8-4ZM200 371l4 8-4 8-4-8ZM13 200l8-4 8 4-8 4Z" />
            <circle cx="74" cy="74" r="3" />
            <circle cx="326" cy="326" r="3" />
            <circle cx="74" cy="326" r="3" />
            <circle cx="326" cy="74" r="3" />
        </g>
    </svg>
</template>
