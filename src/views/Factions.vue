<script setup>
    import Grid from "../components/Grid.vue";
    import Header from "../components/Header.vue";
    import factionsData from '../assets/armyBook.json';

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