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
@use "../assets/style/variables.scss" as *;
    .grid {
        --spacing: 20px;
        width: 60%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: var(--spacing);
        padding: var(--spacing);
        @media screen and (max-width : $breakpointMax-tablet) {
            grid-template-columns: 1fr 1fr;
        }        
        @media screen and (max-width : $breakpointMax-mobile) {
            grid-template-columns: 1fr;
        }
    }
</style>