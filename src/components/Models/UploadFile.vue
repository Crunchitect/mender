<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import Glassy from '../Glassy.vue';
    import Camera from 'simple-vue-camera';

    const url = ref('');
    const openCamera = ref(false);
    const camera = ref<InstanceType<typeof Camera>>();

    const readURL = (file: File): Promise<string> => {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => res(e.target!.result?.toString() ?? '');
            reader.onerror = (e) => rej(e);
            reader.readAsDataURL(file);
        });
    };

    const updateFiles = async (e: Event) => {
        //@ts-ignore
        const imageFile = (<HTMLInputElement>e.target).files[0];
        url.value = await readURL(imageFile);
    };

    const captureCamera = (blob: Blob) => {
        url.value = URL.createObjectURL(blob);
    };
</script>

<template>
    <div class="flex flex-col h-full w-full p-2">
        <Transition class="w-full h-5/6" name="change" mode="out-in">
            <div v-if="url">
                <Glassy class="z-20 m-4 p-4 flex justify-center"
                    ><img class="max-h-[80vh] rounded" :src="url" alt=""
                /></Glassy>
            </div>
            <div v-else-if="openCamera">
                <div class="flex flex-col h-full">
                    <Glassy class="max-h-[80vh]">
                        <Camera @snapshot="captureCamera" ref="camera" class="h-3/5 aspect-video" />
                    </Glassy>
                    <center class="flex">
                        <Glassy class="w-fit px-4 m-4 flex-shrink">
                            <button @click="openCamera = false"><i class="fas fa-chevron-left"></i> Back</button>
                        </Glassy>
                        <Glassy class="w-fit px-4 m-4 flex-shrink">
                            <button @click="camera?.snapshot()"><i class="fas fa-cheese"></i> Cheese!</button>
                        </Glassy>
                    </center>
                </div>
            </div>
            <div v-else>
                <h1 class="font-bold text-center text-lg mb-2">Upload a picture to scan.</h1>
                <div class="flex flex-col gap-2 w-full z-10 h-full">
                    <Glassy class="flex-1 relative">
                        <input
                            @click.prevent
                            @change="updateFiles"
                            type="file"
                            class="absolute w-full h-full opacity-0 z-20"
                        />
                        <div class="w-full h-full flex flex-col flex-wrap place-content-center gap-2">
                            <i class="fas fa-file-import text-6xl text-center"></i>
                            <p class="text-zinc-500 opacity-1/2 text-xs text-center">Upload a File</p>
                        </div>
                    </Glassy>
                    <Glassy @click="openCamera = true" class="flex-1">
                        <div class="w-full h-full flex flex-col flex-wrap place-content-center gap-2">
                            <i class="fas fa-camera text-6xl text-center"></i>
                            <p class="text-zinc-500 opacity-1/2 text-xs text-center">Take a picture</p>
                        </div>
                    </Glassy>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
    * {
        transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .change-enter-from {
        transform: translate(-100vw);
    }

    .change-enter-to,
    .change-leave-from {
        transform: translate(0);
    }

    .change-leave-to {
        transform: translate(100vw);
    }
</style>
