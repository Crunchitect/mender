<script lang="ts" setup>
    import Glassy from '@/components/Glassy.vue';

    const emit = defineEmits<{
        url: [url: string];
        camera: [];
    }>();

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
        emit('url', await readURL(imageFile));
    };
</script>

<template>
    <div>
        <h1 class="font-bold text-center text-lg mb-2">Upload/Take a template picture to scan for models</h1>
        <div class="flex flex-col gap-2 w-full z-10 h-full">
            <Glassy class="flex-1 relative z-10">
                <input
                    @change="updateFiles"
                    type="file"
                    accept="image/*"
                    class="absolute w-full h-full opacity-0 z-20"
                />
                <div class="w-full h-full flex flex-col flex-wrap place-content-center gap-2">
                    <i class="fas fa-file-import text-6xl text-center"></i>
                    <p class="text-zinc-500 opacity-1/2 text-xs text-center">Upload a File</p>
                </div>
            </Glassy>
            <Glassy @click="emit('camera')" class="flex-1 z-10">
                <div class="w-full h-full flex flex-col flex-wrap place-content-center gap-2">
                    <i class="fas fa-camera text-6xl text-center"></i>
                    <p class="text-zinc-500 opacity-1/2 text-xs text-center">Take a picture</p>
                </div>
            </Glassy>
        </div>
    </div>
</template>
