<script setup>
    /**
     * @component Sticker
     * @description
     * Composant visuel représentant une **faction sous forme de vignette** (sticker).
     *
     * Fonctionnalités :
     * - Affiche le logo d’une faction.
     * - Affiche le nom de la faction sous le logo.
     * - Sert généralement d’élément cliquable (utilisé dans `Grid.vue` à l’intérieur d’un `Linker`).
     *
     * Exemple d’utilisation :
     * ```vue
     * <Sticker :faction="faction" />
     * ```
     *
     * Exemple de donnée faction :
     * ```js
     * const faction = {
     *   name: "Égalité",
     *   logo: "/img/factions/egalite.svg"
     * };
     * ```
    */

    /**
     * @prop {Object} faction
     * Objet représentant une faction.
     * Champs attendus :
     * - `name {string}` : nom de la faction
     * - `logo {string}` : chemin de l’image/logo de la faction
    */
    const props = defineProps({
        faction: {
            type: Object,
            required: true
        }
    })
</script>

<template>
    <div class="sticker">
        <img :src="faction.logo" :alt="`Logo de ${faction.name}`" class="sticker_logo"/>
        <p class="sticker_text">{{ faction.name }}</p>
    </div>
</template>

<style scoped lang="scss">
@use "../assets/style/variables.scss" as *;
    .sticker {
        background-color: $color--mca-red;
        border-radius: 5%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
        &_logo {
            width: 50%;
            height: 50%;
            color: $color--light;
        }

        &_text {
            color: $color--light;
        }
    }
</style>

