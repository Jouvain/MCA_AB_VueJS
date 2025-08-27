<script setup>
    /**
    * @view Faction
    * @description
    * Vue affichant le détail d’une faction sélectionnée.
    *
    * Fonctionnalités principales :
    * - Récupère la faction courante à partir du paramètre `slug` de la route.
    * - Affiche le titre, les infos générales (Trivia), et les règles spéciales de la faction.
    * - Liste les profils disponibles via le composant `ProfileSheet`.
    * - Propose un bouton d’appel à l’action pour créer une escouade.
    *
    * Cas particulier :
    * - Si la faction est **Fortune**, ses profils sont générés dynamiquement :
    *   - Fusion de tous les profils des autres factions.
    *   - Ajout d’un champ `originalFaction` pour tracer l’origine de chaque profil.
    *   - Les spécialités de Fortune sont conservées.
    */

    import Header from "../components/Header.vue";
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import dataFactions from "../assets/armyBook.json";
    import Trivia from "../components/Trivia.vue";
    import SpecialRules from "../components/SpecialRules.vue";
    import ButtonCTA from "../components/ButtonCTA.vue";
    import Linker from "../components/Linker.vue";

    /**
    * Paramètre de route représentant la faction sélectionnée.
    * @type {string}
    */
    const route = useRoute();
    const currentSlug = route.params.slug;

    /**
    * Faction courante sélectionnée.
    * Si `Fortune` est choisie, construit une version enrichie avec tous les profils des autres factions.
    *
    * @typedef {Object} Faction
    * @property {string} name - Nom de la faction.
    * @property {Object[]} profiles - Profils de la faction.
    * @property {string} [profiles[].originalFaction] - Faction d’origine du profil (si Fortune).
    * @property {Object[]} specialties - Spécialités de la faction.
    */
    let faction = dataFactions.factions.find(f => f.name === currentSlug);

    if(faction?.name === 'Fortune') {
        // Fusionne tous les profils et spécialités des autres factions
        const allOtherFactions = dataFactions.factions.filter(f => f.name !== "Fortune");

       

        // On crée des clones des profils, en ajoutant originalFaction
        const combinedProfiles = allOtherFactions.flatMap(f =>
            (f.profiles || []).map(p => ({
                ...p, // clone
                originalFaction: f.name // ajout du champ
            }))
        );

        // const combinedProfiles = allOtherFactions.flatMap(f => f.profiles || []);
        // const combinedSpecialties = allOtherFactions.flatMap(f => f.specialties || []);

        // On crée une version étendue de Fortune sans toucher au JSON source
        faction = {
            ...faction,
            profiles: combinedProfiles,
            specialties: faction.specialties
        };    
        

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
                <ProfileSheet :profile="profile"  mode=""  />
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