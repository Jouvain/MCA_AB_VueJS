<script setup>
    const props = defineProps({
        profile: {
            type: Object,
            required: true
        },
        mode: {
            type: String,
            default: undefined
        }
    });

    const emit = defineEmits(['add', 'edit', 'delete']);
</script>

<template>
    <article class="ps">
        <header class="ps_header">
            <h3 class="ps_title">{{ profile.name }}</h3>
            <div class="ps_headband">
                <button v-if="mode === 'edit' " @click="emit('edit', profile)" class="ps_button ps_button--left">
                    <img src="/img/pencil.svg" />
                </button>
                <img v-if="profile.type === 'infanterie' " src="/img/run_White.svg" alt="a logo of a running man" class="ps_rank"/>
                <img v-else src="/img/tank_White.svg" alt="a logo of a tank" class="ps_rank"/>
                <img v-if="profile.rank === 1" src="/img/rank-1_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <img v-else-if="profile.rank === 2" src="/img/rank-2_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <img v-else src="/img/rank-3_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <span>{{ profile.cost }}</span>
                <img src="/img/credits-currency_White.svg" alt="a logo with the stylized acronym Global Credit" class="ps_rank" />
                <button v-if="mode === 'add' " @click="emit('add', profile)" class="ps_button">
                    <img src="/img/health-normal.svg" />
                </button>
                <button v-if="mode === 'edit' " @click="emit('delete', profile)" class="ps_button">
                    <img src="/img/cancel.svg" />
                </button>
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
        &_button {
            background-color: $color--light;
            height: 35px;
            width: 35px;
            position: relative;
            border: 1px groove $color--mca-secondary;
            cursor: pointer;
            border-radius: 5px;
            margin-left: $spacing;
            &--left {
                margin-right: $spacing;
            }
            img {
                position: absolute;
                height: 20px;
                width: 20px;
                top: 7px;
                left: 7px;
            }
        }
    }

</style>