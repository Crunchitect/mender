<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import { RouterView } from 'vue-router';
    import Navbar from '@/components/Navbar.vue';
    import PopUp from '@/components/PopUp.vue';
    import { templateFiles } from './data/SavedModels';
    import SettingsPopup from './components/Repair/SettingsPopup.vue';

    const mouse = ref<HTMLDivElement>();
    const settings = ref<InstanceType<typeof SettingsPopup>>();

    const mouseMove = (e: Event) => {
        //@ts-ignore
        const { clientX, clientY } = e;

        mouse.value!.animate(
            {
                left: `${clientX - 16}px`,
                top: `${clientY - 16}px`,
            },
            { duration: 1000, fill: 'forwards' }
        );
    };

    onMounted(() => {
        templateFiles.value = JSON.parse(localStorage.getItem('templateFiles')!) ?? { main: {} };
    });
</script>

<template>
    <div @mousemove="mouseMove" class="bg-zinc-900 text-white w-screen h-screen flex flex-col overflow-hidden">
        <Navbar />
        <RouterView />
        <PopUp />
        <SettingsPopup ref="settings" />
        <div
            ref="mouse"
            class="absolute rounded-full w-8 aspect-square bg-white blur-md left-0 top-0 pointer-events-none"
        ></div>
    </div>
</template>
