<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import { RouterView } from 'vue-router';
    import Navbar from '@/components/Navbar.vue';
    import { savedModels } from './data/SavedModels';

    const mouse = ref<HTMLDivElement>();

    const mouseMove = (e: Event) => {
        //@ts-ignore
        const { clientX, clientY } = e;

        mouse.value!.animate(
            {
                left: `${clientX}px`,
                top: `${clientY}px`,
            },
            { duration: 1000, fill: 'forwards' }
        );
    };

    onMounted(() => {
        savedModels.value = JSON.parse(localStorage.getItem('savedModels')!);
    });
</script>

<template>
    <div @mousemove="mouseMove" class="bg-zinc-900 text-white w-screen h-screen flex flex-col overflow-hidden">
        <Navbar />
        <RouterView />

        <div ref="mouse" class="absolute rounded-full w-8 aspect-square bg-white blur-md left-0 top-0"></div>
    </div>
</template>
