<script setup>
    /**
     * @component Resume
     * @description
     * Composant d’affichage et d’édition du **résumé d’une escouade**.
     *
     * Fonctionnalités :
     * - Affiche le nom de l’escouade.
     * - Affiche les coûts de composition (points d’armée, officiers).
     * - Calcule et affiche dynamiquement les limites (selon mode choisi et faction).
     * - Permet de renommer l’escouade si on n’est pas en mode impression.
     *
     * Modes :
     * - **Normal** : affichage interactif + bouton pour modifier le nom.
     * - **Impression** (`isForPrint = true`) : présentation compacte et non éditable.
     *
     * Exemple d’utilisation :
     * ```vue
     * <Resume
     *   v-model:squadName="squadName"
     *   :squad-cost="totalCost"
     *   :squad-officer-nb="officerNb"
     *   :chosen-mode="mode"
     *   :faction="faction.name"
     *   :is-for-print="false"
     * />
     * ```
    */
    import { defineModel, defineProps, toRefs, ref, computed } from 'vue'

    /**
     * @model squadName
     * Nom de l’escouade (supporte v-model).
     * @type {string}
    */
    const squadNameModel = defineModel('squadName', { type: String, default: '' })

    /**
     * @prop {number} squadCost
     * Coût total de l’escouade (points d’armée).
     *
     * @prop {number} squadOfficerNb
     * Nombre d’officiers dans l’escouade.
     *
     * @prop {string} chosenMode
     * Mode de jeu choisi (ex. "Blitz", "Standard", "Héroïque").
     *
     * @prop {boolean} [isForPrint=false]
     * Indique si le composant doit s’afficher en mode impression.
     *
     * @prop {string} [faction=""]
     * Nom de la faction de l’escouade (utile pour règles spécifiques comme Domination).
    */
    const props = defineProps({
        squadCost: { type: Number, default: 0 },
        squadOfficerNb: {type: Number, default: 0},
        chosenMode: {type: String},
        isForPrint: {type: Boolean, default: false},
        faction: {type: String, default: ""}
    })
    const { squadCost, squadOfficerNb, chosenMode, faction } = toRefs(props)

    /**
     * Limite d’officiers calculée dynamiquement.
     * - Blitz ou Domination → max 1
     * - Autres cas → max 3
    */
    const officerLimit = computed(() => {
        if(chosenMode.value === 'Blitz' || faction.value === "Domination") {
            return 1;
        } else {
            return 3;
        }      
    })

    /**
     * Limite de points selon le mode choisi.
     * - Blitz : 15
     * - Héroïque : 30
     * - Standard (par défaut) : 25
     */
    const squadLimit = computed(() => {
        if(chosenMode.value === 'Blitz') {
            return 15;
        } else if(chosenMode.value === 'Héroïque') {
            return 30;
        } else {
            return 25;
        }
    })

    
    /**
     * Indique si le formulaire de modification du nom est actif.
     * @type {import("vue").Ref<boolean>}
     */
    const isEditing = ref(false);

</script>

<template>
    <div class="resume">
        <div class="resume_display" :class="{isForPrint: isForPrint}">
            <h2 class="resume_title">{{ squadNameModel }}</h2>
            <div v-if="isForPrint" class="resume_costs">
                <p class="resume_text">Coût : {{ squadCost }} / {{ squadLimit }}</p>
                <p class="resume_text">Officiers : {{ squadOfficerNb }} / {{ officerLimit }}</p>                
            </div>
            <div class="resume_costs--mobile">
                <p v-if="!isForPrint" class="resume_text">Coût : {{ squadCost }} / {{ squadLimit }}</p>
                <p v-if="!isForPrint" class="resume_text">Officiers : {{ squadOfficerNb }} / {{ officerLimit }}</p>
            </div>
        </div>
        <button v-if="!isForPrint" @click="isEditing = !isEditing" class="resume_btn">Modifier le nom</button>
        <div class="resume_edition">
            <form v-if="isEditing" @submit.prevent class="resume_form">
                <label class="resume_label">Nom de l'escouade : </label>
                <input type="text" v-model="squadNameModel" class="resume_input"/>
            </form>
        </div>

    </div>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;

    .resume {
        display: flex;
        flex-direction: column;
        align-items: center;
        &_title {
            color: $color--mca-red;
            font-weight: bold;
            font-size:xx-large;
            margin-top: 10px;
            margin-bottom: 0;
            @media screen and (max-width: $breakpointMax-mobile) {
                font-size: large;
                justify-content: center;
                margin-top: 10px;
                margin-bottom: 0;
            }    
        }
        &_form {
            margin-top: $spacing;
        }
        &_btn {
            background-color: $color--mca-red;
            color: $color--light;
            padding: 10px;
            position: relative;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            margin-left: $spacing;
            @media screen and (max-width: $breakpointMax-mobile) {
                margin-left: 0;
            }   
        }
        &_text {
            color: $color--mca-red;
            font-weight: bold;
            font-size:xx-large;
            margin-top: 0;
            @media screen and (max-width: $breakpointMax-mobile) {
                font-size: large;
                justify-content: center;
                margin-top: 0;
            }                      
        }
        &_display {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: space-around;
            width: 50%;
            @media screen and (max-width: $breakpointMax-mobile) {
                flex-direction: column;
                justify-content: center;
                width: 100%;
            }
        }
        &_edition {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        &_costs {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            gap: 20px;
            margin-top: 0;
            &--mobile {
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: $spacing;
            }
        }
        .isForPrint {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        /* Resume.vue */
        .resume_display.isForPrint {
            width: auto !important;          /* ou 100% */
            display: inline-flex;            /* pour remettre coût/officiers sur une ligne */
            gap: 20px;
            align-items: baseline;
            justify-content: center;         /* centrage horizontal */
            text-align: left;
        }

    }
</style>