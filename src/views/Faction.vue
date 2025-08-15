<script setup>
    import Header from "../components/Header.vue";
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import dataFactions from "../assets/armyBook.json";
    import Trivia from "../components/Trivia.vue";
    import SpecialRules from "../components/SpecialRules.vue";
    import ButtonCTA from "../components/ButtonCTA.vue";
    import Linker from "../components/Linker.vue";

    const route = useRoute();
    const currentSlug = route.params.slug;
    // const faction = dataFactions.factions.find(f => f.name === currentSlug);
    let faction = dataFactions.factions.find(f => f.name === currentSlug);

    if(faction?.name === 'Fortune') {
        // Fusionne tous les profils et spécialités des autres factions
        const allOtherFactions = dataFactions.factions.filter(f => f.name !== "Fortune");

        const combinedProfiles = allOtherFactions.flatMap(f => f.profiles || []);
        const combinedSpecialties = allOtherFactions.flatMap(f => f.specialties || []);

        // On crée une version étendue de Fortune sans toucher au JSON source
        faction = {
            ...faction,
            profiles: combinedProfiles,
            specialties: combinedSpecialties
        };        
    }

    function testBtn() {
        console.log("Bouton cliqué, ça marche");
    }

</script>

<template>
    <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>
    
    <main class="main">



        <div class="trivia-wrapper">
            <Trivia :faction="faction" />
        </div>

        <div class="cta-wrapper">
            <Linker :to="{name: 'squad', params: {slug: currentSlug}}">
                <ButtonCTA />
            </Linker>
        </div>

        <SpecialRules :faction="faction" />

        <div class="gallery">
            <div v-for="(profile, i) in faction.profiles" :key="i" class="gallery_block">
                <ProfileSheet :profile="profile"  mode="" @add="testBtn" @edit="testBtn"/>
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
        margin-top: $spacing;
    }
    .cta-wrapper{
        margin: auto;
        padding: $spacing;
    }    
    .gallery {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing;
        width: 100%;
        margin-bottom: $spacing;
        &_block {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }

</style>