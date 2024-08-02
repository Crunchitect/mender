<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import { printConfig } from '@/data/PrintConfig';
    import { exportFile, printFile, getPrinters, setPrinter } from '@/lib/printModels';
    import { useRouter } from 'vue-router';

    const toTitle = (text: string) =>
        text.replace(/^./, text[0].toUpperCase()).replace(/_/g, ' ').replace('.def.json', '');
    const exportExtension = ref('GCODE');
    const router = useRouter();

    const printerName = ref('anet3d_et4');
    const printers = ref<string[]>([]);

    onMounted(async () => (printers.value = await getPrinters()));

    watch(printerName, (val) => setPrinter(val.replace('.def.json', '')));
</script>

<template>
    <div class="h-full bg-zinc-800 w-2/5 p-2">
        <h1 class="font-bold text-2xl m-4">Model Settings</h1>
        <div class="grid grid-cols-2 gap-2 m-4 items-center">
            <p class="inline align-middle">Model Height</p>
            <input
                class="bg-zinc-900 p-2 outline-none border-b-2 border-slate-950 rounded"
                type="number"
                v-model.number="printConfig.depth"
            />
        </div>
        <h1 class="font-bold text-2xl m-4">Slicing Settings</h1>
        <div class="grid grid-cols-2 gap-2 m-4 items-center">
            <p class="inline align-middle">Printer Name</p>
            <select v-model="printerName" class="bg-zinc-900 p-2 outline-none border-b-2 border-slate-950 rounded">
                <option class="bg-zinc-900" v-for="printer in printers" :value="printer">
                    {{ toTitle(printer) }}
                </option>
            </select>
        </div>
        <button @click.self="exportFile(exportExtension)" class="rounded border-2 border-zinc-500 w-full mb-2">
            Export as
            <select @click.prevent class="bg-transparent" v-model="exportExtension">
                <option class="bg-zinc-900" value="STL">STL</option>
                <option class="bg-zinc-900" value="OBJ">OBJ</option>
                <option class="bg-zinc-900" value="TEMPL">TEMPL</option>
                <option class="bg-zinc-900" value="GCODE">GCODE</option>
            </select>
        </button>
        <button
            @click="
                () => {
                    printFile();
                    router.push('/dashboard');
                }
            "
            class="rounded border-2 border-green-900 bg-green-500/30 hover:bg-green-500 w-full"
        >
            <i class="fas fa-print"></i> Start Printing!
        </button>
    </div>
</template>
