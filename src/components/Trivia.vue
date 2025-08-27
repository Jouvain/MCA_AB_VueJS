<script setup>
    /**
     * @component Trivia
     * @description
     * Composant qui affiche une **présentation courte d’une faction** sous forme de "trivia".
     *
     * Fonctionnalités :
     * - Affiche le logo de la faction.
     * - Affiche sa description textuelle.
     * - Utilisé dans la vue **Faction** comme encart de présentation rapide.
     *
     * Exemple d’utilisation :
     * ```vue
     * <Trivia :faction="faction" />
     * ```
     *
     * Exemple de donnée faction :
     * ```js
     * const faction = {
     *   name: "Fortune",
     *   logo: "/img/factions/fortune.svg",
     *   description: "Une faction opportuniste, maîtresse dans l’art de combiner les atouts des autres."
     * };
     * ```
    */

    /**
     * @prop {Object} faction
     * Objet représentant la faction.
     * Champs attendus :
     * - `logo {string}` : chemin de l’image/logo de la faction
     * - `description {string}` : texte descriptif de la faction
    */
    const props = defineProps({
        faction: {
            type: Object,
            required: true
        }
    })
</script>

<template>
    <div class="trivia">
        <img :src="faction.logo" alt="the faction's logo" class="trivia_logo" />
        <p class="trivia_text" >{{ faction.description }}</p>
    </div>
</template>

<style lang="scss" scoped>
    @use "../assets/style/variables.scss" as *;
    .trivia {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: auto;
        @media screen and (max-width: $breakpointMax-mobile) {
            flex-direction: column;
        }
        &_logo {
            height: 80px;
            color: $color--mca-red;
            filter: invert(88%) sepia(34%) saturate(7483%) hue-rotate(352deg) brightness(103%) contrast(118%);
            margin-right: $spacing;
        }
        &_text {
            font-style: italic;
        }
    }
</style>