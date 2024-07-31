import { ref } from 'vue';

export const repairConfig = ref({
    repairCycle: 300,
    brokenIndex: 0.3,
    huMomentsCoefficient: 1,
    disableTimer: false,
});

export const repairSidebar = ref({
    selectedFileName: '',
    detectedObjects: <[number, number][][]>[],
    brokenObjects: <{ model: [number, number][]; coeff: number }[]>[],
    map: <[[number, number][], [number, number][], number][]>[],
});
