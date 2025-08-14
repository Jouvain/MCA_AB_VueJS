<script setup>
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