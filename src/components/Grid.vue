<script setup>
    import Linker from './Linker.vue';
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
        <Linker v-for="faction in factions" :to="{name: 'faction', params: {slug: faction.slug}}" class="grid_linker">
            <Sticker :faction="faction" />
        </Linker>
        <!-- <Sticker v-for="faction in factions" :faction="faction"></Sticker> -->
    </div>
</template>

<style scoped lang="scss">
@use "../assets/style/variables.scss" as *;
    .grid {
        width: 60%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: $spacing;
        padding: $spacing;
        @media screen and (max-width : $breakpointMax-tablet) {
            grid-template-columns: 1fr 1fr;
        }        
        @media screen and (max-width : $breakpointMax-mobile) {
            grid-template-columns: 1fr;
        }
        &_linker {
            display: contents;
            text-decoration: none;
            color: inherit;
        }
    }
</style>