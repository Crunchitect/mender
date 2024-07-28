<script lang="ts" setup>
    import { onMounted, ref, toRefs, watch } from 'vue';
    import { repairConfig } from '@/data/RepairConfig';
    const timeRemaining = ref(69420);
    const resetTimer = () => {
        timeRemaining.value = repairConfig.value.repairCycle;
    };

    const emit = defineEmits<{
        timeOut: [];
    }>();

    defineExpose({ timeRemaining, resetTimer });

    onMounted(() => resetTimer());

    const formatTime = (secs: number) => {
        const seconds = (secs % 60).toString().padStart(2, '0');
        const minutes = (~~(secs / 60) % 60).toString().padStart(2, '0');
        const hours = ~~(secs / 3600);
        return `${hours}:${minutes}:${seconds}`;
    };

    watch(timeRemaining, (val) => {
        if (val <= 0) emit('timeOut');
    });

    setInterval(() => {
        if (!repairConfig.value.disableTimer && timeRemaining.value > 0) timeRemaining.value--;
    }, 1000);
</script>

<template>
    <p :class="`text-right ${repairConfig.disableTimer && 'text-zinc-500'}`">
        Time Remaining: {{ formatTime(timeRemaining) }}
    </p>
</template>
