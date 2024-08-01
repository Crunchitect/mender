<script lang="ts" setup>
    import Glassy from '@/components/Glassy.vue';
    import { TresCanvas, type TresInstance } from '@tresjs/core';
    import { OrbitControls } from '@tresjs/cientos';
    import { ref, shallowRef, watchEffect, onMounted } from 'vue';
    import * as THREE from 'three';
    import { printConfig } from '@/data/PrintConfig';
    import { dashboardData } from '@/data/Printing';

    const shape = ref<THREE.Shape>(new THREE.Shape());
    const mesh = shallowRef<TresInstance>();

    const updatePreview = () => {
        const selectedModel = dashboardData.value.printingModel;
        if (!selectedModel || !selectedModel.length) return;
        shape.value = new THREE.Shape();
        shape.value.moveTo(...selectedModel?.[0]);
        for (let i = 1; i < selectedModel.length; i++) {
            shape.value.lineTo(...selectedModel?.[i]);
        }
        shape.value.lineTo(...selectedModel?.[0]);
        if (mesh.value)
            mesh.value.geometry = new THREE.ExtrudeGeometry(shape.value, { depth: printConfig.value.depth });
        // if (geometry.value) geometry.value!.parameters.shapes = shape.value;
    };

    watchEffect(updatePreview);
    onMounted(updatePreview);
</script>

<template>
    <div class="w-full h-full flex gap-4 p-4 transition-all">
        <div class="w-3/5 h-full flex flex-col gap-4">
            <h1 class="font-bold text-4xl">
                Printing Model
                {{ Math.round((dashboardData.progressAll / 100) * printConfig.brokenModels.length + 1) }}/{{
                    printConfig.brokenModels.length
                }}
            </h1>
            <Glassy class="flex-1 h-[80vh]">
                <TresCanvas>
                    <TresPerspectiveCamera :position="[50, 50, 50]" />
                    <OrbitControls />
                    <TresMesh ref="mesh" :rotation="[90, 0, 0]">
                        <TresExtrudeGeometry ref="geometry" :args="[shape, { step: 1, depth: 2 }]" />
                        <TresMeshToonMaterial color="white" />
                    </TresMesh>
                    <TresDirectionalLight :position="[0, 1, 2]" :intensity="1.2" cast-shadow />
                </TresCanvas>
            </Glassy>
            <div class="flex-1">
                <div>
                    <h1 class="font-bold text-2xl">Printing Progress</h1>
                    <div class="flex gap-4 items-center m-2 p-2">
                        <div class="h-8 w-5/6 bg-zinc-950 rounded">
                            <div
                                class="progressbar rounde h-full"
                                :style="{ width: `${dashboardData.progress}%` }"
                            ></div>
                        </div>
                        <p>{{ dashboardData.progress }}%</p>
                    </div>
                </div>
                <div>
                    <h1 class="font-bold text-2xl">Overall Progress</h1>
                    <div class="flex gap-4 items-center m-2 p-2">
                        <div class="h-8 w-5/6 bg-zinc-950 rounded">
                            <div
                                class="progressbar rounded h-full"
                                :style="{ width: `${dashboardData.progressAll}%` }"
                            ></div>
                        </div>
                        <p>{{ dashboardData.progressAll }}%</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-2/5">
            <div class="flex-1 flex flex-col gap-4">
                <div class="flex flex-col gap-4">
                    <h1 class="font-bold text-2xl">STL Code</h1>
                    <textarea
                        disabled
                        v-model="dashboardData.STLCode"
                        class="bg-zinc-950 h-[40vh] rounded border-2 border-zinc-500"
                    ></textarea>
                </div>
                <div class="flex flex-col gap-4">
                    <h1 class="font-bold text-2xl">GCODE Code</h1>
                    <textarea
                        disabled
                        v-model="dashboardData.GCode"
                        class="bg-zinc-950 h-[40vh] rounded border-2 border-zinc-500"
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .progressbar {
        background-image: repeating-linear-gradient(-45deg, white 0px 20px, #ddd 20px 40px);
        background-size: 300%;
        animation: move 750ms linear 0s infinite forwards;
    }

    @keyframes move {
        from {
            background-position-x: -57px;
        }
        to {
            background-position-x: 0%;
        }
    }
</style>
