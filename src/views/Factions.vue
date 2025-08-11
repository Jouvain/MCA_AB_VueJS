<script setup>
    import Grid from "../components/Grid.vue";
    import Header from "../components/Header.vue";
    import factionsData from '../assets/armyBook.json';
</script>

<template>
    <Header title="Choix de la faction"></Header>
    <main class="main">
        <Grid :factions="factionsData.factions"></Grid>
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