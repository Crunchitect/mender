<script lang="ts" setup>
    import { printConfig } from '@/data/PrintConfig';
    import Content from '@/components/Print/Content.vue';
    import Sidebar from '@/components/Print/Sidebar.vue';
</script>

<template>
    <div class="w-full h-full flex gap-4">
        <Content />
        <Sidebar />
    </div>
</template>
