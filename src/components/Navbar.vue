<script lang="ts" setup>
    import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="bg-zinc-950 w-screen h-max-1/5 flex justify-between p-2 z-50">
        <div class="heading flex flex-wrap items-center gap-4">
            <img src="../assets/fixfuse.svg" alt="" />
            <h1 class="line-clamp-4 align-center font-bold">Fixfuse</h1>
        </div>
        <div class="flex items-center space-evenly gap-4">
            <RouterLink to="/">Files</RouterLink>
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
