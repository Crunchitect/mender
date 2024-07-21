<script lang="ts" setup>
    import { RouterLink } from 'vue-router';
    import Mender from '@/components/icons/Mender.vue';
</script>

<template>
    <div class="bg-zinc-950 w-screen h-max-1/5 flex justify-between p-2 z-50">
        <div class="heading flex flex-wrap items-center gap-4">
            <Mender />
            <h1 class="line-clamp-4 align-center font-bold">Mender</h1>
        </div>
        <div class="flex items-center space-evenly gap-4">
            <RouterLink to="/">Models</RouterLink>
            <RouterLink to="/repair">Repair</RouterLink>
            <RouterLink to="/print">Print</RouterLink>
            <RouterLink to="/dashboard">Dashboard</RouterLink>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    .router-link-active {
        @apply font-bold text-slate-900 px-2 bg-white rounded;
    }
</style>
