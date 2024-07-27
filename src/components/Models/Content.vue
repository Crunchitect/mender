<script lang="ts" setup>
    import { ref } from 'vue';

    import UploadFile from './Content/UploadFile.vue';
    import Camera from './Content/CameraComp.vue';
    import Processing from './Content/Processing.vue';

    const url = ref('');
    const openCamera = ref(false);
</script>

<template>
    <div class="flex flex-col h-full w-full p-2">
        <Transition class="w-full h-5/6" name="change" mode="out-in">
            <Processing v-if="url" :url="url" @exit="url = ''" />
            <Camera v-else-if="openCamera" @url="(e) => (url = e)" @exit="openCamera = false" />
            <UploadFile v-else @url="(e) => (url = e)" @camera="openCamera = true" />
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
