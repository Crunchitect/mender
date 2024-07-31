<script lang="ts" setup>
    import Content from '@/components/Print/Content.vue';
    import Sidebar from '@/components/Print/Sidebar.vue';
    import Settings from '@/components/Print/Settings.vue';
</script>

<template>
    <div class="w-full h-full flex gap-4">
        <Sidebar />
        <Content />
        <Settings />
    </div>
</template>
