import { ref, watch } from 'vue';

type PolygonPoints = [number, number][][];

export const savedModels = ref<PolygonPoints>();

watch(savedModels, (val) => {
    localStorage.setItem('savedModels', JSON.stringify(val));
});

export function saveObjects(polys: PolygonPoints) {
    savedModels.value = polys;
}
