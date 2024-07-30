<script lang="ts" setup>
    import { findObjects } from '@/lib/findObjects';
    import { saveFile, fillNames, templateFiles } from '@/data/SavedModels';
    import Glassy from '@/components/Glassy.vue';
    import { ref, onMounted } from 'vue';

    const props = defineProps<{
        url: string;
    }>();

    const emit = defineEmits<{
        exit: [];
    }>();

    const image = ref<HTMLImageElement>();

    onMounted(async () => {
        await image.value?.decode();
        saveFile(...fillNames(findObjects(image.value)));
    });
</script>

<template>
    <div class="flex flex-col">
        <Glassy class="z-20 m-4 p-4 flex flex-wrap place-content-center">
            <!-- <canvas width="600" height="600" id="hey"></canvas> -->
            <img class="rounded max-w-[600px]" :src="url" alt="" ref="image" />
        </Glassy>
        <div class="flex flex-row gap-4 justify-evenly">
            <Glassy class="flex flex-wrap justify-center items-center">
                <button class="flex flex-wrap place-content-center gap-2 align-middle" @click="emit('exit')">
                    <i class="fas fa-chevron-left align-middle"></i> Back
                </button>
            </Glassy>
            <Glassy class="flex flex-wrap justify-center items-center">
                <button
                    class="flex flex-wrap place-content-center gap-2 align-middle"
                    @click="saveFile(...fillNames(findObjects(image)))"
                >
                    <i class="fas fa-screwdriver-wrench"></i> Find Objects
                </button>
            </Glassy>
        </div>
    </div>
</template>
