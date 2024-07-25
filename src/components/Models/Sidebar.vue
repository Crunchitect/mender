<script lang="ts" setup>
    import { ref, computed } from 'vue';
    import Glassy from '../Glassy.vue';

    const navOpened = ref(true);
    const cssNav = computed(() => +navOpened.value);
    const toggleNav = () => (navOpened.value = !navOpened.value);
</script>

<template>
    <div class="nav max-h-full bg-zinc-800">
        <i @click="toggleNav" class="fas fa-chevron-left p-2 inline"></i>
        <div class="nav-inner" v-show="navOpened">
            <h1 class="p-2 font-bold inline m-4 text-center truncate">Saved Models</h1>
            <div class="h-screen flex flex-col p-2 gap-2 overflow-auto z-10">
                <div v-for="i in 99">
                    <Glassy class="z-20">
                        <div class="m-2">
                            <p class="text-sm">i don know what to put here, skibidi dop dop yes yes</p>
                        </div>
                    </Glassy>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    * {
        transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .nav {
        width: calc(40% - (35% * (1 - v-bind(cssNav))));
    }

    .nav-inner {
        opacity: calc(v-bind(cssNav));
    }
</style>
