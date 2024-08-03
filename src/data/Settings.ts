import { ref, watch } from 'vue';

export const settings = ref({
    devMode: false,
});

const $log = console.log;
watch(
    settings,
    (val) => {
        console.log = val.devMode ? $log : () => {};
    },
    { deep: true }
);
