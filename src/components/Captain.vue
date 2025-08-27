<script setup>

    /**
     * @component Captain
     * @description
     * Composant d’édition et d’affichage du **Capitaine** de l’escouade.
     *
     * Fonctionnalités :
     * - Affiche le nom du capitaine sélectionné.
     * - Permet de choisir une doctrine (spécialité) parmi une liste prédéfinie.
     * - Si `isForPrint` est vrai, le formulaire est masqué (mode impression).
     *
     * Exemple d’utilisation :
     * ```vue
     * <Captain :captain="captain" :is-for-print="false" />
     * ```
     *
     * Exemple de donnée capitaine :
     * ```js
     * const captain = {
     *   name: "Marcus",
     *   doctrine: "Stratège"
     * };
     * ```
    */

    import { ref } from 'vue';


    /**
     * @prop {Object} captain
     * Objet représentant le profil du capitaine.
     * Doit contenir au minimum :
     * - `name {string}` : le nom du capitaine
     * - `doctrine {string|null}` : doctrine choisie (optionnelle, éditable)
     *
     * @prop {boolean} [isForPrint=false]
     * Indique si le composant doit s’afficher en mode impression.
     * - `false` : formulaire interactif affiché
     * - `true` : seul le nom et la doctrine sont affichés
    */    
    const props = defineProps({
        captain: {
            type: Object,
            required: true
        },
        isForPrint: {type: Boolean, default: false}
    })

    /**
     * Liste des doctrines disponibles pour le capitaine.
     * @type {import("vue").Ref<string[]>}
    */
    const doctrines = ref([
        'Barbare',
        'Commando',
        'Conquérant',
        'Esclavagiste',
        'Espion',
        'Ferrailleur',
        'Guerrier',
        'Meneur',
        'Netrunner',
        'Opportuniste',
        'Pionnier',
        'Politicien',
        'Stratège'
    ])

</script>

<template>
    <p class="captain_title"> Capitaine : {{ captain.name }} <span v-if="captain.doctrine != null">({{ captain.doctrine }})</span></p>
    <div v-if="!isForPrint" class="captain_form ">       
        <label class="captain_label">Spécialité : </label>
        <select v-model="captain.doctrine" class="captain_select">
            <option v-for="doctrine in doctrines" :key="doctrine" :value="doctrine" @click.prevent="test">{{ doctrine }}</option>
        </select>       
    </div>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
    .captain {
        &_title {
            text-align: center;
            font-size: large;
            font-weight: bold;
            color: $color--mca-red;
        }
        &_form {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
        &_label {
            color: $color--mca-red;
            font-size: large;
            font-weight: bold;
        }
        &_select {
            padding: 5px;
            margin-left: 5px;
        }
    }
</style>