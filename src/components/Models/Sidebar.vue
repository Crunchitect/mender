<script lang="ts" setup>
    import { ref, computed, watch } from 'vue';
    import { zip } from '@/lib/utils';
    import { openedFileName, templateFiles } from '@/data/SavedModels';
    import { exportFile } from '@/lib/exportFile';

    const navOpened = ref(true);
    const cssNav = computed(() => +navOpened.value);
    const toggleNav = () => (navOpened.value = !navOpened.value);

    const editableTemplateFiles = ref(Object.entries(templateFiles.value));
    const exportExtension = ref<'TEMPL' | 'STL' | 'OBJ'>('TEMPL');

    const getBBox = (model: [number, number][]) => {
        console.log(model.length);
        const [x, y] = zip(...model);
        return `0 0 ${Math.max(...x)} ${Math.max(...y)}`;
    };

    const getSize = (model: [number, number][]) => {
        const [x, y] = zip(...model);
        return [~~Math.max(...x), ~~Math.max(...y)];
    };

    const newFile = () => {
        editableTemplateFiles.value.push([`file${Object.keys(templateFiles!.value).length}`, {}]);
    };

    const downloadFile = (fileName: string) => {
        const textToSave = JSON.stringify(templateFiles.value[fileName]);
        const downloadEl = document.createElement('a');
        downloadEl.href = 'data:attachment/text,' + encodeURI(textToSave);
        downloadEl.target = '_blank';
        downloadEl.download = `${fileName}.templ`;
        downloadEl.click();
    };

    const importTempl = async (e: Event) => {
        const input = <HTMLInputElement>e.target;
        const name = input.files![0].name.replace(/\.templ$/, '');
        const content = JSON.parse(await input.files![0].text());
        editableTemplateFiles.value.push([name, content]);
    }

    watch(
        editableTemplateFiles,
        () => {
            templateFiles.value = {};
            editableTemplateFiles.value.forEach(([name, value]) => {
                templateFiles.value[name] = value;
            });
            localStorage.setItem('templateFiles', JSON.stringify(templateFiles.value));
        },
        { deep: true }
    );
    watch(templateFiles, () => localStorage.setItem('templateFiles', JSON.stringify(templateFiles.value)), {
        deep: true,
    });
</script>

<template>
    <div class="nav max-h-full bg-zinc-800">
        <i @click="toggleNav" class="fas fa-chevron-left p-2 inline"></i>
        <div class="nav-inner" v-show="navOpened">
            <h1 class="p-2 font-bold inline m-4 text-center truncate">Recent Files</h1>
            <div class="h-[30vh] flex flex-col space-between p-2 gap-2 overflow-auto z-10">
                <div
                    v-for="([fileName, _], index) in editableTemplateFiles"
                    :class="`rounded border-2 border-zinc-500 ${
                        fileName === openedFileName && 'bg-white text-black border-0'
                    }`"
                >
                    <div
                        @click="openedFileName = <string>fileName"
                        class="relative flex flex-wrap flex-shrink items-center justify-between px-2 p-1"
                    >
                        <p>
                            <input
                                v-model="editableTemplateFiles[index][0]"
                                :class="`border-none outline-none bg-transparent text-inherit inline`"
                                :style="{ width: `${editableTemplateFiles[index][0].length}ch` }"
                            />.templ
                        </p>
                        <div class="flex flex-row-reverse gap-4">
                            <i class="fas fa-download" @click="downloadFile(fileName)"></i>
                            <i class="fas fa-trash" @click="editableTemplateFiles.splice(index, 1)"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rounded relative border-2 border-zinc-500 flex justify-center">
                <input type="file" accept=".templ" @change="importTempl" class="absolute top-0 left-0 w-full h-full opacity-0 z-20"></input>
                <div><i class="fas fa-upload"></i> Import TEMPL File</div>
            </div>
            <div class="rounded border-2 border-zinc-500 flex justify-center">
                <button @click="newFile" class="w-full h-full"><i class="fas fa-add"></i> Create New File</button>
            </div>
            <hr class="text-zinc-500" />
            <h1 class="p-2 font-bold inline m-4 text-center truncate">{{ openedFileName }}.templ - Models</h1>
            <div class="h-[40vh] flex flex-col space-between p-2 gap-2 overflow-auto z-10">
                <div v-for="(points, name) in templateFiles[openedFileName!]">
                    <div class="rounded-lg border-2 border-zinc-500 relative px-2 p-1">
                        <p><span class="text-zinc-500">Name:</span> {{ name }}</p>
                        <div
                            class="relative flex flex-wrap flex-shrink flex-col items-center justify-evenly gap-4 before:content-[''] min-h-24 min-w-48"
                        >
                            <svg class="aspect-square" width="20%" height="20%" :viewBox="getBBox(points)">
                                <polyline :points="points.join(' ')" fill="white"></polyline>
                            </svg>
                            <p>Size: {{ getSize(points)[0] }}mm x {{ getSize(points)[1] }}mm</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="rounded border-2 border-zinc-500">
                    <button @click="" class="w-full h-full">
                        <i class="fas fa-screwdriver-wrench"></i> Print Template
                    </button>
                </div>
                <div class="rounded border-2 border-zinc-500">
                    <button
                        @click.self="exportFile(templateFiles[openedFileName!], openedFileName!, exportExtension)"
                        class="w-full h-full"
                    >
                        <i class="fas fa-download"></i> Export as
                        <select @click.prevent v-model="exportExtension" class="bg-transparent">
                            <option class="bg-zinc-950" value="TEMPL">TEMPL</option>
                            <option class="bg-zinc-950" value="STL">STL</option>
                            <option class="bg-zinc-950" value="OBJ">OBJ</option>
                        </select>
                    </button>
                </div>
                <div class="rounded border-2 border-zinc-500">
                    <button @click="templateFiles[openedFileName!] = {}" class="w-full h-full">
                        <i class="fas fa-trash"></i> Delete Template
                    </button>
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
