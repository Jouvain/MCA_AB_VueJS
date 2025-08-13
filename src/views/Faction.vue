<script setup>
    import Header from "../components/Header.vue";
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import dataFactions from "../assets/armyBook.json";

    const route = useRoute();
    const currentSlug = route.params.slug;

    const faction = dataFactions.factions.find(f => f.name === currentSlug);

</script>

<template>
    <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>
    <div class="gallery">
        <div v-for="(profile, i) in faction.profiles" :key="i" class="gallery_block">
            <ProfileSheet :profile="profile" />
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;    
    .gallery {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing;
        padding: $spacing;
        &_block {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }
</style>