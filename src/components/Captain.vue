<script setup>
import { ref } from 'vue';

    const props = defineProps({
        captain: {
            type: Object,
            required: true
        },
        isForPrint: {type: Boolean, default: false}
    })

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