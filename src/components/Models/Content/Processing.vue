<script lang="ts" setup>
    import { findObjects } from '@/lib/findObjects';
    import { saveObjects } from '@/data/SavedModels';
    import Glassy from '@/components/Glassy.vue';

    const props = defineProps<{
        url: string;
    }>();

    const emit = defineEmits<{
        exit: [];
    }>();
</script>

<template>
    <div class="flex flex-col">
        <Glassy class="z-20 m-4 p-4 flex flex-wrap place-content-center">
            <!-- <canvas width="600" height="600" id="hey"></canvas> -->
            <img class="rounded max-w-[600px]" :src="url" alt="" id="findObjectSrc" />
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
                    @click="saveObjects(findObjects())"
                >
                    <i class="fas fa-wand-magic-sparkles align-middle"></i> Find Objects
                </button>
            </Glassy>
        </div>
    </div>
</template>
