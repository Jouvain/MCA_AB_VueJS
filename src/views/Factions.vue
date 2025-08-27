<script setup>
    /**
     * Vue de sélection de la faction dans l'application d'army builder.
     *
     * Cette vue :
     * - Importe et affiche un composant `Header` pour le titre de la page.
     * - Importe et affiche un composant `Grid` pour présenter les factions disponibles.
     * - Charge les données des factions depuis `armyBook.json`.
     * - Transforme chaque faction en lui ajoutant une propriété `slug` basée sur son nom.
     */
    import Grid from "../components/Grid.vue";
    import Header from "../components/Header.vue";
    import factionsData from '../assets/armyBook.json';

    /**
     * Liste des factions disponibles.
     *
     * @typedef {Object} Faction
     * @property {string} name - Nom de la faction.
     * @property {string} slug - Identifiant textuel dérivé du nom (utilisé pour les clés, routes, etc.).
     * @property {any} [otherProps] - Autres propriétés éventuelles présentes dans le JSON.
     */

    /**
     * Tableau de factions enrichies avec un `slug`.
     * @type {Faction[]}
     */

    const factions = factionsData.factions.map(f => ({
        ...f,
        slug:f.name
    }))

</script>

<template>
    <Header title="Choix de la faction"></Header>
    <main class="main">
        <!-- <Grid :factions="factionsData.factions"></Grid> -->
         <Grid :factions="factions" />
    </main>
</template>

<style scoped lang="scss">
    .main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>