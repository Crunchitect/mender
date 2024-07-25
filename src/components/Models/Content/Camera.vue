<script lang="ts" setup>
    import Glassy from '@/components/Glassy.vue';
    import type Camera from 'simple-vue-camera';
    import { ref } from 'vue';

    const emit = defineEmits<{
        url: [url: string];
        exit: [];
    }>();

    const camera = ref<InstanceType<typeof Camera>>();
    const captureCamera = (blob: Blob) => {
        emit('url', URL.createObjectURL(blob));
    };
</script>

<template>
    <div>
        <div class="flex flex-col h-full">
            <Glassy class="max-h-[80vh]">
                <Camera @snapshot="captureCamera" ref="camera" class="h-3/5 aspect-video" />
            </Glassy>
            <center class="flex">
                <Glassy class="w-fit px-4 m-4 flex-shrink">
                    <button @click="emit('exit')"><i class="fas fa-chevron-left"></i> Back</button>
                </Glassy>
                <Glassy class="w-fit px-4 m-4 flex-shrink">
                    <button @click="camera?.snapshot()"><i class="fas fa-cheese"></i> Cheese!</button>
                </Glassy>
            </center>
        </div>
    </div>
</template>
