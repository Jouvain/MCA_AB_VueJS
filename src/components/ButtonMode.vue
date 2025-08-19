<script setup>
    const props = defineOptions({
        text: {type: String, required: true}
    });
</script>

<template>
    <button> {{ text }} </button>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
</style>