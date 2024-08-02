import { ref } from 'vue';

export const dashboardData = ref({
    printingModel: <[number, number][]>[],
    currentGCode: '',
    GCode: '',
    STLCode: '',
    progress: '0',
    progressAll: 0,
    extruderTemp: 0,
    extruderTargetTemp: 0,
    bedTemp: 0,
    bedTargetTemp: 0,
});
