<script lang="ts" setup>
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { repairConfig, repairSidebar } from '@/data/RepairConfig';
    import Glassy from '../Glassy.vue';
    import { zip } from '@/lib/utils';
    import { templateFiles } from '@/data/SavedModels';
    import { printConfig } from '@/data/PrintConfig';
    const navOpened = ref(true);
    const cssNav = computed(() => +navOpened.value);
    const toggleNav = () => (navOpened.value = !navOpened.value);

    const router = useRouter();

    const objectView = ref('detected');

    const importTempl = async (e: Event) => {
        const input = <HTMLInputElement>e.target;
        const name = input.files![0].name.replace(/\.templ$/, '');
        const content = JSON.parse(await input.files![0].text());
        templateFiles.value[name] = content;
    };

    const toTitle = (str: string) => {
        const titleStr = str.replace(/([A-Z])/g, ` $1`);
        return titleStr[0].toUpperCase() + titleStr.slice(1);
    };

    const getBBox = (model: [number, number][]) => {
        if (!model || !model.length) return;
        const [x, y] = zip(...model);
        return `0 0 ${Math.max(...x)} ${Math.max(...y)}`;
    };

    const getSize = (model: [number, number][]) => {
        if (!model || !model.length) return;
        const [x, y] = zip(...model);
        return [~~Math.max(...x), ~~Math.max(...y)];
    };
    
    const addToPrintQueue = () => {
        repairSidebar.value.brokenObjects
            .forEach(e => printConfig.value.brokenModels.push(e));
        router.push('/print');
    };

    defineExpose({ repairConfig });
</script>

<template>
    <div class="nav max-h-full bg-zinc-800">
        <i @click="toggleNav" class="fas fa-chevron-left p-2 inline"></i>
        <div class="nav-inner" v-show="navOpened">
            <h1 class="font-bold text-2xl inline m-4 text-center truncate">Recent Files</h1>
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
            <div class="rounded relative border-2 border-zinc-500 flex justify-center">
                <input type="file" accept=".templ" @change="importTempl" class="absolute top-0 left-0 w-full h-full opacity-0 z-20"></input>
                <div><i class="fas fa-upload"></i> Import TEMPL File</div>
            </div>
            <h1 class="font-bold text-2xl inline m-4 text-center truncate">Repair Settings</h1>
            <div class="grid grid-cols-2 gap-2 m-4">
                <template v-for="(val, config) in repairConfig">
                    <p class="inline align-middle">{{ toTitle(config) }}</p>
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
            <h1 class="font-bold text-2xl inline m-4 text-center truncate">
                <select class="bg-transparent" v-model="objectView">
                    <option class="bg-zinc-900" value="detected">Detected Objects</option>
                    <option class="bg-zinc-900" value="missing">Missing/Derelict Objects</option>
                    <option class="bg-zinc-900" value="diff">Diff (Unison)</option>
                    <option class="bg-zinc-900" value="splitdiff">Diff (Split)</option>
                </select>
            </h1>
            <div class="h-[38vh] flex flex-col p-2 gap-2 overflow-auto z-10">
                <Glassy v-if="objectView === 'detected'" v-for="(model, idx) in repairSidebar.detectedObjects">
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
                            <polyline :points="model?.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(model)?.[0] }}mm x {{ getSize(model)?.[1] }}mm</p>
                    </div>
                </Glassy>
                <Glassy v-else-if="objectView === 'missing'" v-for="{ model, coeff } in repairSidebar.brokenObjects">
                    <div
                        class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                    >
                        <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(model)">
                            <polyline :points="model?.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(model)?.[0] }}mm x {{ getSize(model)?.[1] }}mm</p>
                        <p>Derelict Value: {{ coeff }}</p>
                    </div>
                </Glassy>
                <Glassy v-else-if="objectView === 'diff'" v-for="[ templ, broken, coeff ] in repairSidebar.map">
                    <div
                        v-if="coeff === Infinity"
                        class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48 bg-red-500/30"
                    >
                        <i class="far fa-square-minus absolute top-0 left-0 p-4 text-lg text-red-500"></i>
                        <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(templ)">
                            <polyline :points="templ?.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(templ)?.[0] }}mm x {{ getSize(templ)?.[1] }}mm</p>
                        <p>Derelict Value: {{ coeff }}</p>
                    </div>
                    <div
                        v-else-if="coeff > repairConfig.brokenIndex"
                        class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48 bg-yellow-500/30"
                    >
                        <i class="far fa-square-minus absolute top-0 left-0 p-4 text-lg text-yellow-500"></i>
                        <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(templ)">
                            <polyline :points="templ?.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(templ)?.[0] }}mm x {{ getSize(templ)?.[1] }}mm</p>
                        <p>Derelict Value: {{ coeff }}</p>
                    </div>
                    <div
                        v-else-if="coeff === -Infinity"
                        class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48 bg-green-500/30"
                    >
                        <i class="far fa-square-plus absolute top-0 left-0 p-4 text-lg text-green-500"></i>
                        <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(broken)">
                            <polyline :points="broken?.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(broken)?.[0] }}mm x {{ getSize(broken)?.[1] }}mm</p>
                        <p>Derelict Value: {{ coeff }}</p>
                    </div>
                    <div
                        v-else
                        class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                    >
                        <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(broken)">
                            <polyline :points="broken?.join(' ')" fill="white"></polyline>
                        </svg>
                        <p>Size: {{ getSize(broken)?.[0] }}mm x {{ getSize(broken)?.[1] }}mm</p>
                        <p>Derelict Value: {{ coeff }}</p>
                    </div>
                </Glassy>
                <div v-else class="grid grid-cols-2 gap-2">
                    <p>Template</p>
                    <p>Scanned</p>
                    <template v-for="[ templ, broken, coeff ] in repairSidebar.map">
                        <template v-if="coeff === Infinity">
                            <Glassy
                                class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48 bg-red-500/30"
                            >
                                <i class="far fa-square-minus absolute top-0 left-0 p-4 text-lg text-red-500"></i>
                                <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(templ)">
                                    <polyline :points="templ?.join(' ')" fill="white"></polyline>
                                </svg>
                                <p>Size: {{ getSize(templ)?.[0] }}mm x {{ getSize(templ)?.[1] }}mm</p>
                                <p>Derelict Value: {{ coeff }}</p>
                            </Glassy>
                            <div></div>
                        </template>
                        <template v-else-if="coeff > repairConfig.brokenIndex">
                            <Glassy
                                class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                            >
                                <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(templ)">
                                    <polyline :points="templ?.join(' ')" fill="white"></polyline>
                                </svg>
                                <p>Size: {{ getSize(templ)?.[0] }}mm x {{ getSize(templ)?.[1] }}mm</p>
                                <p>Derelict Value: {{ coeff }}</p>
                            </Glassy>
                            <Glassy
                                class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48 bg-yellow-500/30"
                            >
                                <i class="far fa-square-minus absolute top-0 left-0 p-4 text-lg text-yellow-500"></i>
                                <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(broken)">
                                    <polyline :points="broken?.join(' ')" fill="white"></polyline>
                                </svg>
                                <p>Size: {{ getSize(broken)?.[0] }}mm x {{ getSize(broken)?.[1] }}mm</p>
                                <p>Derelict Value: {{ coeff }}</p>
                            </Glassy>
                        </template>
                        <template v-else-if="coeff === -Infinity">
                            <div></div>
                            <Glassy
                                class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48 bg-green-500/30"
                            >
                                <i class="far fa-square-plus absolute top-0 left-0 p-4 text-lg text-green-500"></i>
                                <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(broken)">
                                    <polyline :points="broken?.join(' ')" fill="white"></polyline>
                                </svg>
                                <p>Size: {{ getSize(broken)?.[0] }}mm x {{ getSize(broken)?.[1] }}mm</p>
                                <p>Derelict Value: {{ coeff }}</p>
                            </Glassy>
                        </template>
                        <template v-else-if="coeff < repairConfig.brokenIndex">
                            <Glassy
                                class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                            >
                                <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(templ)">
                                    <polyline :points="templ?.join(' ')" fill="white"></polyline>
                                </svg>
                                <p>Size: {{ getSize(templ)?.[0] }}mm x {{ getSize(templ)?.[1] }}mm</p>
                                <p>Derelict Value: {{ coeff }}</p>
                            </Glassy>
                            <Glassy
                                class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                            >
                                <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(broken)">
                                    <polyline :points="broken?.join(' ')" fill="white"></polyline>
                                </svg>
                                <p>Size: {{ getSize(broken)?.[0] }}mm x {{ getSize(broken)?.[1] }}mm</p>
                                <p>Derelict Value: {{ coeff }}</p>
                            </Glassy>
                        </template>
                    </template>
                </div>
            </div>
            <div class="rounded border-2 border-zinc-500">
                <button @click="addToPrintQueue" class="w-full h-full">
                    <i class="fas fa-print"></i> Add to Print Queue
                </button>
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
