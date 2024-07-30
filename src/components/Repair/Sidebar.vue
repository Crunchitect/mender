<script lang="ts" setup>
    import { ref, computed } from 'vue';
    import { repairConfig, repairSidebar } from '@/data/RepairConfig';
    import Glassy from '../Glassy.vue';
    import { zip } from '@/lib/utils';
    import { templateFiles } from '@/data/SavedModels';
    const navOpened = ref(true);
    const cssNav = computed(() => +navOpened.value);
    const toggleNav = () => (navOpened.value = !navOpened.value);

    const toTitle = (str: string) => {
        const titleStr = str.replace(/([A-Z])/g, ` $1`);
        return titleStr[0].toUpperCase() + titleStr.slice(1);
    };

    const getBBox = (model: [number, number][]) => {
        const [x, y] = zip(...model);
        return `0 0 ${Math.max(...x)} ${Math.max(...y)}`;
    };

    const getSize = (model: [number, number][]) => {
        const [x, y] = zip(...model);
        return [~~Math.max(...x), ~~Math.max(...y)];
    };

    defineExpose({ repairConfig });
</script>

<template>
    <div class="nav max-h-full bg-zinc-800">
        <i @click="toggleNav" class="fas fa-chevron-left p-2 inline"></i>
        <div class="nav-inner" v-show="navOpened">
            <h1 class="p-2 font-bold inline m-4 text-center truncate">Recent Files</h1>
            <div class="h-[15vh] flex flex-col space-between p-2 gap-2 overflow-auto z-10">
                <div
                    v-for="(_, fileName) in templateFiles"
                    :class="`rounded border-2 border-zinc-500 ${
                        fileName === repairSidebar.selectedFileName && 'bg-white text-black border-0'
                    }`"
                >
                    <div
                        @click="repairSidebar.selectedFileName = <string>fileName"
                        class="relative flex flex-wrap flex-shrink items-center justify-between px-2 p-1"
                    >
                        <p>{{ fileName }}.templ</p>
                    </div>
                </div>
            </div>
            <h1 class="font-bold text-2xl m-4">Repair Settings</h1>
            <div class="grid grid-cols-2 gap-4 m-4">
                <template v-for="(val, config) in repairConfig">
                    <p class="inline align-middle text-lg">{{ toTitle(config) }}</p>
                    <input
                        v-if="typeof val === 'number'"
                        class="bg-zinc-900 p-2 outline-none border-b-2 border-slate-950 rounded"
                        type="number"
                        v-model.number="repairConfig[config]"
                    />
                    <input
                        v-else-if="typeof val === 'boolean'"
                        class="accent-transparent text-transparent"
                        type="checkbox"
                        v-model="repairConfig[config]"
                    />
                </template>
            </div>
            <h1 class="font-bold text-2xl m-4">Detected Objects</h1>
            <div class="h-[58vh] flex flex-col p-2 gap-2 overflow-auto z-10">
                <Glassy v-for="(model, idx) in repairSidebar.detectedObjects">
                    <div
                        class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                    >
                        <i
                            @click="
                                repairSidebar.detectedObjects = repairSidebar.detectedObjects?.filter(
                                    (_, i) => i !== idx
                                )
                            "
                            class="fas fa-trash absolute top-0 left-0 p-4 hover:text-red-400"
                        ></i>
                        <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(model)">
                            <polyline :points="model.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(model)[0] }}mm x {{ getSize(model)[1] }}mm</p>
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
