<script lang="ts" setup>
    import { findObjects } from '@/lib/findObjects';
    import { saveObjects, savedModels } from '@/data/SavedModels';
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
                    <i class="fas fa-screwdriver-wrench"></i> Find Objects
                </button>
            </Glassy>
        </div>
        <button
            class="flex-shrink h-fit w-full border-green-950 border-2 bg-green-500/30 hover:bg-green-500 p-2 px-4 my-2 rounded-lg transition-all disabled:opacity-10 disabled:bg-green-500/30"
            :disabled="!savedModels?.length"
            @click="$router.push('/repair')"
        >
            <i class="fas fa-screwdriver-wrench"></i> Start Repairing!
        </button>
    </div>
</template>
