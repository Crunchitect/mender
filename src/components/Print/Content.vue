<script lang="ts" setup>
    import { onMounted, ref, shallowRef, toRaw, watchEffect } from 'vue';
    import { TresCanvas, type TresInstance } from '@tresjs/core';
    import { OrbitControls } from '@tresjs/cientos';
    import * as THREE from 'three';
    import { printConfig } from '@/data/PrintConfig';

    const shape = ref<THREE.Shape>(new THREE.Shape());

    const geometry = shallowRef<TresInstance>();

    const updatePreview = () => {
        const selectedModel = printConfig.value.brokenModels[printConfig.value.selectedIndex];
        console.log(printConfig.value.brokenModels);
        if (selectedModel == undefined) return;
        shape.value.moveTo(...selectedModel.model[0]);
        for (let i = 1; i < selectedModel.model.length; i++) {
            shape.value.lineTo(...selectedModel.model[i]);
        }
        shape.value.lineTo(...selectedModel.model[0]);
        if (geometry.value) geometry.value!.args = [toRaw(shape.value), { step: 1, depth: 2 }];
    };

    watchEffect(updatePreview);
    onMounted(updatePreview);
</script>

<template>
    <div class="w-full h-full">
        <TresCanvas>
            <TresPerspectiveCamera />
            <OrbitControls />
            <TresMesh :rotation="[90, 0, 0]">
                <TresExtrudeGeometry ref="geometry" :args="[shape, { step: 1, depth: 2 }]" />
                <TresMeshToonMaterial color="white" />
            </TresMesh>
            <TresDirectionalLight :position="[0, 1, 2]" :intensity="1.2" cast-shadow />
        </TresCanvas>
    </div>
</template>
