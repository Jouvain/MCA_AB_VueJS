<script setup>
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
    .sticker {
        background-color: var(--mca-red);
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
            color: var(--light);
        }

        &_text {
            color: var(--light);
        }
    }
</style>

