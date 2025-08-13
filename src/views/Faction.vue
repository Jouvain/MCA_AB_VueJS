<script setup>
    import Header from "../components/Header.vue";
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import dataFactions from "../assets/armyBook.json";
import Trivia from "../components/Trivia.vue";
import SpecialRules from "../components/SpecialRules.vue";

    const route = useRoute();
    const currentSlug = route.params.slug;

    const faction = dataFactions.factions.find(f => f.name === currentSlug);

</script>

<template>
    <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>
    
    <main class="main">



        <div class="trivia-wrapper">
            <Trivia :faction="faction" />
        </div>

        <SpecialRules :faction="faction" />

        <div class="gallery">
            <div v-for="(profile, i) in faction.profiles" :key="i" class="gallery_block">
                <ProfileSheet :profile="profile" />
            </div>
        </div>
    </main>
    

</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;

    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .trivia-wrapper {
        display: flex;
        width: 80%;
        justify-content: center;
        align-items: center;
        align-content: center;
    }    
    .gallery {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing;
        width: 100%;
        &_block {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }
</style>