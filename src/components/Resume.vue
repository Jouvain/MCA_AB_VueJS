<script setup>
    import { defineModel, defineProps, toRefs, ref } from 'vue'

    const squadNameModel = defineModel('squadName', { type: String, default: '' })

    const props = defineProps({
        squadCost: { type: Number, default: 0 }
    })
    const { squadCost } = toRefs(props)

    const isEditing = ref(false);

</script>

<template>
    <div class="resume">
        <div class="resume_display">
            <h2 class="resume_title">{{ squadNameModel }}</h2>
            <p class="resume_text">Coût : {{ squadCost }}</p>
        </div>
        <button @click="isEditing = !isEditing" class="resume_btn">Modifier le nom</button>
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
            font-size:xx-large
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
        }
        &_text {
            color: $color--mca-red;
            font-weight: bold;
            font-size:xx-large          
        }
        &_display {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-around;
            width: 50%;
        }
        &_edition {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
    }
</style>