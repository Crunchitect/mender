<script lang="ts" setup>
    import Glassy from '@/components/Glassy.vue';
    import Camera from 'simple-vue-camera';
    import { ref } from 'vue';

    const emit = defineEmits<{
        url: [url: string];
        exit: [];
    }>();

    const camera = ref<InstanceType<typeof Camera>>();
    const snapshot = async () => {
        const blob = await camera!.value?.snapshot();
        emit('url', URL.createObjectURL(blob!));
    };
</script>

<template>
    <div>
        <div class="flex flex-col h-full">
            <Glassy class="max-h-[80vh]">
                <Camera ref="camera" />
            </Glassy>
            <div class="flex justify-center">
                <Glassy class="w-fit px-4 m-4 flex-shrink flex justify-center">
                    <button @click="emit('exit')"><i class="fas fa-chevron-left"></i> Back</button>
                </Glassy>
                <Glassy class="w-fit px-4 m-4 flex-shrink flex justify-center">
                    <button @click="snapshot"><i class="fas fa-cheese"></i> Cheese!</button>
                </Glassy>
            </div>
        </div>
    </div>
</template>
