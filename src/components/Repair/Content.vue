<script lang="ts" setup>
    import Glassy from '@/components/Glassy.vue';
    import Camera from 'simple-vue-camera';
    import Timer from '@/components/Repair/Content/Timer.vue';
    import { ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { findObjects } from '@/lib/findObjects';
    import { repairConfig, repairSidebar } from '@/data/RepairConfig';
    import { savedModels } from '@/data/SavedModels';
    import { mapModels } from '@/lib/mapModels';
    import { printConfig } from '@/data/PrintConfig';

    const router = useRouter();

    const camera = ref<InstanceType<typeof Camera>>();
    const timer = ref<InstanceType<typeof Timer>>();

    const checkModels = async () => {
        const img = await camera.value!.snapshot()!;
        const base64 = URL.createObjectURL(img!);
        const imgTag = document.createElement('img');
        imgTag.src = base64;
        await new Promise((r) => {
            imgTag.onload = r;
        });
        repairSidebar.value.detectedObjects = findObjects(imgTag);
    };

    const preparePrintModels = async () => {
        timer.value?.resetTimer();
        printTime.value = 30;

        const brokenModels = mapModels(savedModels.value!, repairSidebar.value.detectedObjects)
            .filter(([, , coeff]) => coeff >= repairConfig.value.brokenIndex!)
            .map(([templ, , coeff]) => ({ model: templ, coeff: coeff }));
        printConfig.value.brokenModels = brokenModels;
        router.push('/print');
    };

    const printTime = ref(30);
    watch(printTime, (val) => {
        if (val <= 0) preparePrintModels();
    });

    setInterval(() => {
        if (!repairConfig.value.disableTimer && repairSidebar.value.detectedObjects.length) printTime.value--;
    }, 1000);
</script>

<template>
    <div class="flex flex-col m-4 p-4 gap-2 h-[90vh]">
        <Glassy class="max-h-[80vh] p-4 h-4/5">
            <Camera ref="camera" class="h-3/5 aspect-video" :resolution="{ width: 600, height: 337 }" />
        </Glassy>
        <Timer ref="timer" @time-out="checkModels" />
        <Glassy class="flex justify-center">
            <button @click="checkModels"><i class="fa fa-search"></i> Check Models!</button>
        </Glassy>
        <button
            class="flex-shrink h-fit w-full border-green-950 border-2 bg-green-500/30 hover:bg-green-500 p-2 px-4 my-2 rounded-lg transition-all disabled:opacity-10 disabled:bg-green-500/30"
            :disabled="!repairSidebar.detectedObjects.length"
            @click="preparePrintModels"
        >
            <i class="fas fa-screwdriver-wrench"></i> Start Printing!
            <span :class="repairConfig.disableTimer && 'text-gray-500'">({{ printTime }} secs)</span>
        </button>
    </div>
</template>
