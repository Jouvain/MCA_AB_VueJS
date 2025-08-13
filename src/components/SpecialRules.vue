<script setup>
    const props = defineProps({
        faction: {
            type: Object,
            required: true
        }
    })
</script>

<template>
    <section class="special">
        <div class="special_rules">
            <div v-for="specialRule, i in faction.specialRule" :key="i"  class="special_rule">
                <p class="special_title">{{ specialRule.name }}</p>
                <p class="special_text">{{ specialRule.rule }}</p>
            </div>
        </div>
        <div class="special_roles">
            <p> Spécialités possibles : {{ faction.specialties }}</p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    @use "../assets/style/variables.scss" as *;
    .special {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: auto;
        width: 80%;
        &_rules {
            border: 1px solid $color--mca-red;
            border-radius: 5px;
            padding: $spacing;
        }
        &_title {
            color: $color--mca-red;
            font-weight: bold;
            margin-bottom: 0;
        }
        &_text {
            margin-top: 0;
        }
        &_roles {
            font-weight: bold;
            text-align: center;
            margin: $spacing;
        }
    }

</style>