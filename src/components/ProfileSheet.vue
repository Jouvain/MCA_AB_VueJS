<script setup>
    const props = defineProps({
        profile: {
            type: Object,
            required: true
        }
    })
</script>

<template>
    <article class="ps">
        <header class="ps_header">
            <h3 class="ps_title">{{ profile.name }}</h3>
            <div class="ps_headband">
                <span>{{ profile.type }}</span>
                <img v-if="profile.rank === 1" src="/img/rank-1_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <img v-else-if="profile.rank === 2" src="/img/rank-2_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <img v-else src="/img/rank-3_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <span>{{ profile.cost }}</span>
                <img src="/img/credits-currency_White.svg" alt="a logo with the stylized acronym Global Credit" class="ps_rank" />
            </div>
        </header>
        <section class="ps_section ps_core">
            <table class="ps_table">
                <thead class="ps_thead">
                    <tr>
                        <th>MOV</th> <th>END</th> <th>VOL</th> <th>CBT</th>
                    </tr>
                </thead>
                <tbody class="ps_tbody">
                    <tr>
                        <td>{{ profile.move }}</td>
                        <td>{{ profile.endurance }}</td>
                        <td>{{ profile.will }}</td>
                        <td>{{ profile.combat }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <section class="ps_section ps_trivia">
            <strong>Règles : </strong>
            <span>{{ profile.specialRule }}</span>
        </section>
        <section class="ps_section ps_weapons">
            <table class="ps_table">
                <thead class="ps_thead">
                    <tr>
                        <th>Arme</th> <th>Longueur</th> <th>Rafale</th> <th>Puissance</th>
                    </tr>
                </thead>
                <tbody class="ps_tbody">
                    <tr v-for="(weapon, i) in profile.weapons" :key="i">
                        <td>{{ weapon.name }}</td>
                        <td>{{ weapon.Longueur ?? '-' }}</td>
                        <td>{{ weapon.Rafale ?? '-' }}</td>
                        <td>{{ weapon.Puissance ?? '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </article>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
    .ps{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        border: 2px solid $color--mca-red;
        width: 80%;
        @media screen and (max-width: $breakpointMax-mobile) {
            font-size: small;
        }
        &_header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background-color: $color--mca-red;
            color: $color--light;
            width: 100%;
            @media screen and (max-width: $breakpointMax-mobile) {
                flex-direction: column;
                align-items: flex-start;
            }
        }
        &_title {
            margin-left: $spacing;
        }
        &_headband {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-right: $spacing;
            @media screen and (max-width: $breakpointMax-mobile) {
                justify-content: center;
                width: 100%;
                margin-bottom: $spacing;
            }
        }
        &_section {
            width: 100%;
        }
        &_thead {
            background-color: $color--mca-secondary;
            width: 100%;
        }
        &_table {
            width: 100%;
        }
        &_tbody {
            width: 100%;
            text-align: center;
            background-color: $color--mca-tertiary;
        }
        &_rank {
            height: 35px;
        }
        &_trivia {
            margin-left: $spacing;
        }
    }

</style>