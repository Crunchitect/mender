<script lang="ts" setup>
    import Content from '@/components/Repair/Content.vue';
    import Sidebar from '@/components/Repair/Sidebar.vue';
    import { ref } from 'vue';

    const sidebar = ref<InstanceType<typeof Sidebar>>();
    const content = ref<InstanceType<typeof Content>>();
</script>

<template>
    <div class="w-full h-full flex gap-4">
        <Sidebar ref="sidebar" />
        <Content ref="content" />
    </div>
</template>
