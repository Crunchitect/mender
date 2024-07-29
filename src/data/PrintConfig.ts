import { ref } from 'vue';

export const printConfig = ref({
    brokenModels: <{ model: [number, number][]; coeff: number }[]>[],
    selectedIndex: 0,
});
