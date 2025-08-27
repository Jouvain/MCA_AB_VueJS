<script setup>
/**
 * @component ButtonCTA
 * @description
 * Bouton d’appel à l’action (CTA : Call To Action).
 *
 * Fonctionnalités :
 * - Affiche un bouton stylisé "Créer une escouade".
 * - Ne prend actuellement aucune prop ni event.
 * - Peut être enrichi ultérieurement (label dynamique, événements @click).
 *
 * Exemple d’utilisation :
 * ```vue
 * <ButtonCTA @click="handleCreateSquad" />
 * ```
 */
</script>

<template>
    <button class="button-cta">Créer une escouade</button>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
    .button-cta {
        background-color: $color--mca-red;
        color: $color--light;
        padding: $spacing;
        border-radius: 5px;
        border: none;
        cursor: pointer;
    }

</style>