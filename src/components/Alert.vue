<script setup >
    const props = defineProps({
        tooExpensive: {type: Boolean},
        tooMuchOffciers: {type: Boolean}
    })
</script>

<template>
    <div v-if="tooExpensive || tooMuchOffciers" class="alert">
        <p class="alert_title">ALERTE</p>
        <div class="alert_details">
            <p v-if="tooExpensive" class="alert_detail"> (trop de Points d'Armée !) </p>
            <p v-if="tooMuchOffciers" class="alert_detail"> (trop d'Officiers !) </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
    .alert {
        display: flex;
        flex-direction: column;
        align-items: center;
        &_title {
            color: $color--mca-red;
            font-weight: bold;
            font-size: larger;
        }
        &_details {
            display: flex;
            justify-content: center;
            @media screen and (max-width: $breakpointMax-mobile) {
                flex-direction: column;
                align-items: center;
            }
        }
        &_detail {
            margin: $spacing;
            margin-top: 0;
            font-weight: bold;
        }
    }
</style>