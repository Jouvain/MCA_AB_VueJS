<script setup>
    /**
     * @component ButtonMode
     * @description
     * Bouton permettant de sélectionner un mode de jeu (ex. Blitz, Standard, Héroïque).
     *
     * Fonctionnement :
     * - Reçoit en prop une chaîne de caractères `mode`.
     * - Affiche ce mode comme label du bouton.
     * - Lors d’un clic, émet un événement `mode` avec la valeur correspondante.
     *
     * Exemple d’utilisation :
     * ```vue
     * <ButtonMode
     *   mode="Blitz"
     *   @mode="modifyMode"
     * />
     * ```
     *
     * Exemple de gestion côté parent :
     * ```js
     * function modifyMode(newMode) {
     *   mode.value = newMode;
     * }
     * ```
     */

    /**
     * @prop {string} mode
     * Libellé du mode affiché sur le bouton.
     * Sert également de valeur renvoyée lors du clic.
     */     
    const props = defineProps({
        mode: {type: String, required: true}
    });

    /**
     * @event mode
     * Événement émis lors du clic sur le bouton.
     * @property {string} payload - Valeur du mode sélectionné.
     */
    const emit = defineEmits(['mode']);
    function buttonClick() {
        emit('mode');
    }

</script>

<template>
    <button @click="emit('mode', mode)"> {{ mode }} </button>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
</style>