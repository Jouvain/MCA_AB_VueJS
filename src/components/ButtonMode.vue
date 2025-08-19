<script setup>
    const props = defineProps({
        mode: {type: String, required: true}
    });
    const emit = defineEmits(['mode']);

    function buttonClick() {
        emit('mode');
    }

</script>

<template>
    <button @click="emit('mode', mode)"> {{ mode }} </button>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
</style>