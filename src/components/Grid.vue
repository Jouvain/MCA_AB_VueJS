<script setup>
    import Sticker from './Sticker.vue';

    const props = defineProps({
        factions: {
            type: Array,
            required: true
        }
    })
</script>

<template>
    <div class="grid">
        <Sticker v-for="faction in factions" :faction="faction"></Sticker>
    </div>
</template>

<style scoped lang="scss">
    .grid {
        --spacing: 20px;
        width: 60%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: var(--spacing);
        padding: var(--spacing);
    }
</style>