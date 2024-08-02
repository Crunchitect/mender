<script lang="ts" setup>
    import { ref } from 'vue';
    const show = ref(true);
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
            <h1 class="text-4xl font-bold m-4">A Heads-up!</h1>
            <p class="m-4">Before starting to use <b>Fixfuse</b>, Please install the <b>Fixfuse Slicer</b>.</p>
            <p class="m-4">Fixfuse will communicate with the slicer for a smoother experience.</p>
            <a href="https://github.com/Crunchitect/mender-glue/releases/tag/2.0">
                <button
                    class="border-2 border-green-500 bg-green-400/30 hover:bg-green-400 p-2 m-4 rounded transition-all"
                >
                    <i class="fas fa-download"></i> Install <b>Fixfuse Slicer 2.0.0</b>
                </button>
            </a>
            <p class="m-4">Then <b>Extract</b> and run <code class="bg-zinc-950 p-4">server.exe</code></p>
            <i class="fas fa-print opacity-30 text-[18rem] -rotate-6 absolute -bottom-20 -right-20 z-0"></i>
        </div>
    </div>
</template>
