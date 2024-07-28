import { ref } from 'vue';

export const repairConfig = ref({
    repairCycle: 300,
    brokenIndex: 0.3,
    huMomentsCoefficient: 1,
    disableTimer: false,
});

export const repairSidebar = ref({
    detectedObjects: <[number, number][][]>[],
});
