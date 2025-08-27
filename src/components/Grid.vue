<script setup>
    /**
     * @component Grid
     * @description
     * Composant qui affiche une grille de factions disponibles.
     *
     * Fonctionnalités :
     * - Reçoit un tableau de factions en prop.
     * - Pour chaque faction, affiche un `Sticker` cliquable.
     * - Chaque `Sticker` est encapsulé dans un `Linker` qui redirige vers la vue `Faction`
     *   correspondante (basée sur le `slug` de la faction).
     *
     * Exemple d’utilisation :
     * ```vue
     * <Grid :factions="factions" />
     * ```
     *
     * Exemple de donnée `faction` :
     * ```js
     * {
     *   name: "Égalité",
     *   slug: "egalite",
     *   profiles: [...],
     *   specialties: [...]
     * }
     * ```
    */

    import Linker from './Linker.vue';
    import Sticker from './Sticker.vue';


    /**
     * @prop {Object[]} factions
     * Tableau des factions à afficher.
     * Chaque faction doit contenir :
     * - `slug {string}` : identifiant unique pour la route
     * - `name {string}` : nom de la faction
     * - (autres champs facultatifs : `profiles`, `specialties`, etc.)
    */    
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