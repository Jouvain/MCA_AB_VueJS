<script setup>
    import Header from "../components/Header.vue"
    import { useRoute } from "vue-router";
    import dataFactions from "../assets/armyBook.json";
    
    const route = useRoute();
    const currentSlug = route.params.slug;
    const faction = dataFactions.factions.find(f => f.name === currentSlug);
</script>

<template>
    <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>
</template>