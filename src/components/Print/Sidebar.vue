<script lang="ts" setup>
    import Glassy from '../Glassy.vue';
    import { printConfig } from '@/data/PrintConfig';
    import { ref, computed } from 'vue';
    import { zip } from '@/lib/utils';

    const navOpened = ref(true);
    const cssNav = computed(() => +navOpened.value);
    const toggleNav = () => (navOpened.value = !navOpened.value);

    const getBBox = (model: [number, number][]) => {
        const [x, y] = zip(...model);
        return `0 0 ${Math.max(...x)} ${Math.max(...y)}`;
    };

    const getSize = (model: [number, number][]) => {
        const [x, y] = zip(...model);
        return [~~Math.max(...x), ~~Math.max(...y)];
    };
</script>

<template>
    <div class="nav max-h-full bg-zinc-800">
        <i @click="toggleNav" class="fas fa-chevron-left p-2 inline"></i>
        <div class="nav-inner" v-show="navOpened">
            <h1 class="font-bold text-2xl m-4">{{ printConfig.brokenModels.length }} model(s) to print.</h1>
            <div class="h-[90vh] flex flex-col p-2 gap-2 overflow-auto z-10">
                <Glassy v-for="model in printConfig.brokenModels">
                    <div
                        class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                    >
                        <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(model.model)">
                            <polyline :points="model.model.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(model.model)[0] }}mm x {{ getSize(model.model)[1] }}mm</p>
                        <p>Broken Coeff.: {{ model.coeff }}</p>
                    </div>
                </Glassy>
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
