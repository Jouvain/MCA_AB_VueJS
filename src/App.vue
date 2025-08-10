<script setup lang="ts">
import Factions from './views/Factions.vue';

</script>

<template>
  <nav>
    <router-link to="/factions">Factions</router-link> 
    <router-link to="/faction">Faction</router-link> 
    <router-link to="/squad">Squad</router-link> 
  </nav>
  <router-view />
</template>



<style scoped>
  .logo {
  height: 6em;
  will-change: filter;
  transition: filter 300ms;
  }
</style>