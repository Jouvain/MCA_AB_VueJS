<script setup>
    import { defineModel, defineProps, toRefs, ref, computed } from 'vue'

    const squadNameModel = defineModel('squadName', { type: String, default: '' })

    const props = defineProps({
        squadCost: { type: Number, default: 0 },
        squadOfficerNb: {type: Number, default: 0},
        chosenMode: {type: String},
        isForPrint: {type: Boolean, default: false},
        faction: {type: String, default: ""}
    })
    const { squadCost, squadOfficerNb, chosenMode, faction } = toRefs(props)

    const officerLimit = computed(() => {
        if(chosenMode.value === 'Blitz' || faction.value === "Domination") {
            return 1;
        } else {
            return 3;
        }      
    })

    const squadLimit = computed(() => {
        if(chosenMode.value === 'Blitz') {
            return 15;
        } else if(chosenMode.value === 'Héroïque') {
            return 30;
        } else {
            return 25;
        }
    })

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
            <p v-if="!isForPrint" class="resume_text">Coût : {{ squadCost }} / {{ squadLimit }}</p>
            <p v-if="!isForPrint" class="resume_text">Officiers : {{ squadOfficerNb }} / {{ officerLimit }}</p>
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
            @media screen and (max-width: $breakpointMax-mobile) {
                font-size: large;
                justify-content: center;
                margin-top: $spacing;
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
            @media screen and (max-width: $breakpointMax-mobile) {
                font-size: large;
                justify-content: center;
                margin-top: 0;
            }                      
        }
        &_display {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-around;
            width: 50%;
            @media screen and (max-width: $breakpointMax-mobile) {
                flex-direction: column;
                justify-content: center;
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