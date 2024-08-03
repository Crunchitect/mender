<script lang="ts" setup>
    import { settings } from '@/data/Settings';
    import { ref } from 'vue';
    const show = ref(true);

    const updateShow = (val: boolean) => (show.value = val);
    defineExpose({ updateShow });
</script>

<template>
    <div
        v-if="show"
        class="absolute top-0 left-0 w-screen h-screen flex flex-wrap place-content-center bg-black/60 backdrop-blur-lg z-[9999]"
    >
        <div class="bg-zinc-900 rounded relative m-4 p-4 overflow-hidden">
            <i
                @click="show = false"
                class="fas fa-circle-xmark text-red-500/30 hover:text-red-500 absolute top-0 right-0 p-2"
            ></i>
            <h1 class="text-4xl font-bold m-4">Settings</h1>
            <div class="grid grid-cols-2 gap-2">
                <p>Developer Mode</p>
                <input type="checkbox" v-model="settings.devMode" />
            </div>
        </div>
    </div>
</template>
