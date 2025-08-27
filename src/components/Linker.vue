<script setup>
    /**
     * @component Linker
     * @description
     * Composant utilitaire qui encapsule un `RouterLink` de Vue Router.
     *
     * Fonctionnalités :
     * - Reçoit en prop une destination (`to`).
     * - Transmet cette destination au `RouterLink` natif.
     * - Rend son contenu via un slot (libre : texte, image, autre composant).
     *
     * Exemple d’utilisation :
     * ```vue
     * <Linker :to="{ name: 'faction', params: { slug: faction.slug }}">
     *   <Sticker :faction="faction" />
     * </Linker>
     * ```
     *
     * Avantage :
     * - Sert de wrapper sémantique, ce qui permet de centraliser
     *   un style ou une logique commune sur tous les liens internes.
    */

    /**
     * @prop {string|Object} to
     * Destination de la navigation.
     * - Peut être une chaîne (URL ou chemin de route).
     * - Peut être un objet de route Vue Router `{ name, params, query }`.
    */
    const props = defineProps({ to: { type: [String, Object], required: true } })
</script>

<template>
    <RouterLink :to="to"><slot /></RouterLink>
</template>
