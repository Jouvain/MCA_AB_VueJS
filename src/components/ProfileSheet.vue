<script setup>
import { computed, toRefs, ref, watch } from 'vue';

    const props = defineProps({
        profile: {
            type: Object,
            required: true
        },
        mode: {
            type: String,
            default: undefined
        },
        index: {
            type: Number,
            default: undefined
        },
        specialtyOptions: {
            type: Array,
            default: () => []
        },
        canGrade: {
            type: Boolean,
            default: true
        },
        roles: {
            type: Array
        },
        items: {
            type: Array
        },
        battleMode: {
            type: String,
            default: 'Standard'
        },
        captainNb: {
            type: Number,
            default: 0
        },
        faction: {
            type: String,
            default: ""
        }
    });

    const emit = defineEmits(['add', 'edit', 'delete', 'reset', 'lighter', 'heroe', 'melee', 'captain']);

    const isEditing = ref(false);
    const localGrade = ref(props.profile.grade ?? 0);
    const localSpecs = ref(props.profile.specialties ?? []);

    watch(() => props.profile, (p) => {
        localGrade.value = p?.grade ?? 0
        localSpecs.value = p?.specialties ?? []
    }, {deep: true});


    function save() {
        emit('update', {
            index: props.index,
            grade: localGrade.value,
            specialties: localSpecs.value
        });
        isEditing.value = false;
    }

    function replaceWeapon(index) {
        const newWeapon = {
            name: "Arme de mêlée",
            Longueur: 0,
            Rafale: "0",
            Puissance: "7"
        };
        props.profile.weapons.splice(index, 1, newWeapon);
    }

    const isBrutal = computed(() => {
        return props.profile.weapons.filter(w => w.Longueur === 0).length >= 2;
    });

    const specialRuleList = computed(() => {
        if(props.profile.specialRule === null) {
            return "";
        } else {
            return props.profile.specialRule;
        }
    });

    const { faction } = toRefs(props)

    const effectiveCost = computed( () => {
        let specialtyCost = 0;
        if(props.profile.specialRoles.length > 0) {
            specialtyCost = 1;
        }
        if( props.profile.specialRule != null && props.profile.specialRule.includes('Héroïque')) {
            specialtyCost += 1;
        }
        if(props.profile.meleeHeroe != null && props.profile.meleeHeroe === true) {
            specialtyCost += 1;
        }
        if(faction.value === 'Fortune' && props.profile.name != null && props.profile.name.includes("avec")) {
            specialtyCost += 1;
        }
        return props.profile.cost + (props.profile.grade ?? 0) + specialtyCost;
    });

</script>

<template>
    <article class="ps">
        <header class="ps_header">
            <div v-if="profile.grade >= 1" class="ps_grade">
                <img v-if="profile.grade >= 1" src="/img/star1_White.svg" class="ps_stars"/>
                <img v-if="profile.grade >= 2" src="/img/star1_White.svg" class="ps_stars"/>
                <img v-if="profile.grade >= 3" src="/img/star1_White.svg" class="ps_stars"/>
            </div>
            <h3 class="ps_title">{{ profile.name }}</h3>
            <div class="ps_headband">
                <img v-if="profile.specialRule != null && profile.specialRule.includes('Héroïque') && profile.isCaptain != true " src="/img/laurels_White.svg" class="ps_rank" />
                <img v-if="profile.isCaptain != null && profile.isCaptain === true" src="/img/laurel-crown_White.svg" class="ps_rank"/>
                <button v-if="mode === 'edit' " @click="isEditing = !isEditing" class="ps_button ps_button--left">
                    <img src="/img/pencil.svg" />
                </button>
                <img v-if="profile.type === 'infanterie' " src="/img/run_White.svg" alt="a logo of a running man" class="ps_rank"/>
                <img v-else src="/img/tank_White.svg" alt="a logo of a tank" class="ps_rank"/>
                <img v-if="profile.rank === 1" src="/img/rank-1_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <img v-else-if="profile.rank === 2" src="/img/rank-2_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <img v-else src="/img/rank-3_White.svg" alt="a logo with as many stripes as the rank" class="ps_rank"/>
                <span>{{ effectiveCost }}</span>
                <img src="/img/credits-currency_White.svg" alt="a logo with the stylized acronym Global Credit" class="ps_rank" />
                <button v-if="mode === 'add' " @click="emit('add', profile)" class="ps_button">
                    <img src="/img/health-normal.svg" />
                </button>
                <button v-if="mode === 'edit' " @click="emit('delete', profile)" class="ps_button">
                    <img src="/img/cancel.svg" />
                </button>
            </div>
        </header>
        <section v-if="mode === 'edit' && isEditing" class="ps_edition">
            <div class="ps_form ps_form--grade">
                <label>Grade : </label>
                <select v-model="profile.grade" :disabled="profile.type !== 'infanterie' || (!canGrade && localGrade === 0) " >
                    <option :value="0"> - </option>
                    <option :value="1"> 1 </option>
                    <option :value="2"> 2 </option>
                    <option :value="3"> 3 </option>
                </select>
                <small v-if="profile.type !== 'infanterie' ">Impossible de grader</small>
                <small v-else-if="!canGrade && localGrade === 0">Limite de grades atteinte</small>
            </div>
            <div class="ps_form ps_form--id">
                <label>Nom : </label>
                <input type="text" v-model="profile.name" />
            </div>
            <div class="ps_form ps_form--special">
                <label>Spécialité : </label>
                <select v-model="profile.specialRoles">
                    <option v-for="role in roles" :key="role" :value="role" @click.prevent="test">{{ role }}</option>
                </select>
            </div>
            <div class="ps_form ps_form--equipment">
                <label>Équipement :</label>                  
                    <div class="checkbox-list">
                        <label v-for="item in items" :key="item" class="checkbox-item">
                        <input
                            type="checkbox"
                            :value="item"
                            v-model="profile.equipment"
                        />
                        {{ item }}
                        </label>
                    </div>
            </div>
            <div class="ps_form ps_form--action">
                <button @click="emit('reset', profile)">RESET</button>
            </div>

        </section>
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
            <strong>Règles : 
                <button v-if="profile.type === 'blindé' && mode === 'edit' && props.profile.specialRule === null && faction != 'Faim' " class="ps_button--small" @click="emit('lighter')" > <img src="/img/jeep.svg" /> </button> 
                <button v-else-if="profile.type === 'blindé' && mode === 'edit' && !props.profile.specialRule.includes('Structure légère') && faction != 'Faim' " class="ps_button--small" @click="emit('lighter')" > <img src="/img/jeep.svg" /> </button>
                <button v-if="profile.type === 'infanterie' && mode === 'edit' && battleMode === 'Héroïque' && props.profile.specialRule === null " class="ps_button--small" @click="emit('heroe')" > <img src="/img/laurels.svg" /> </button>
                <button v-else-if="profile.type === 'infanterie' && mode === 'edit' && battleMode === 'Héroïque' && !props.profile.specialRule.includes('Héroïque') " class="ps_button--small" @click="emit('heroe')" > <img src="/img/laurels.svg" /> </button>
                <button v-if="profile.type === 'infanterie' && mode === 'edit' && battleMode === 'Héroïque' && props.profile.specialRule != null && props.profile.specialRule.includes('Héroïque') && props.profile.meleeHeroe != true " class="ps_button--small" @click="emit('melee')" > <img src="/img/bowie-knife.svg" /> </button>
                <button v-if="profile.type === 'infanterie' && mode === 'edit' && battleMode === 'Héroïque' && props.profile.specialRule != null && props.profile.specialRule.includes('Héroïque') && captainNb < 1 " class="ps_button--small" @click="emit('captain')" > <img src="/img/laurel-crown.svg" /> </button>
            </strong>
            <span v-if="profile.specialRoles.length > 0 && profile.specialRule !== null" >{{ profile.specialRule }} , {{ profile.specialRoles }}</span>
            <span v-else-if="profile.specialRoles.length > 0 ">{{ profile.specialRoles }}</span>
            <span v-else>{{ profile.specialRule }}</span>
            <span v-for="equipment in profile.equipment"> &nbsp {{ equipment }}</span>
            <span v-if="isBrutal"> - Brutal  </span>
            <span v-if="faction === 'Science' && profile.type === 'infanterie' "> - Optiques  </span>
            <span v-if="faction === 'Science' && profile.grade != null && profile.grade >= 1"> - Hacker  </span>
            <span v-if="faction === 'Faim' && profile.type === 'blindé' "> - Titan </span>
            <span v-if="faction === 'Domination' && profile.grade != null && profile.grade >= 1"> - Neuromech </span>
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
                        <td class="ps_weapon-line">{{ weapon.name }} <button v-if="profile.rank >= 3 && mode === 'edit' && (weapon.Longueur > 0 || weapon.Longueur === 'souffle') || profile.type === 'blindé' && mode === 'edit' && (weapon.Longueur > 0 || weapon.Longueur === 'souffle' ) " class="ps_button--small" @click="replaceWeapon(i)"> <img src="/img/bowie-knife.svg" /> </button></td>
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
        position: relative;
        @media screen and (max-width: $breakpointMax-mobile) {
            font-size: small;
        }
        &_grade {
            position: absolute;
            top: -8px;
            left: -8px;
        }
        &_stars {
            height: 35px;
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
        &_edition {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            padding: $spacing 0 $spacing $spacing;
            gap: 10px;
        }
        &_form {
            label {
                font-weight: bold;
                color: $color--mca-red;
            }
            &--action {
                display: flex;
                justify-content: center;
                padding-top: $spacing;
                width: 100%;
                button {
                    background-color: $color--mca-red;
                    color: $color--light;
                    border: none;
                    border-radius: 5%;
                    padding: 5px;
                    cursor: pointer;
                    font-weight: bold;
                }
            }
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
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: fit-content;
            margin-left: $spacing;
            flex-wrap: wrap;
            @media screen and (max-width: $breakpointMax-mobile) {
                flex-wrap: wrap;
            }
            span {
                margin-left: 3px;
                @media screen and (max-width: $breakpointMax-mobile) {
                    margin-left: 0;
                    margin-bottom: 3px;
                }
            }
            strong {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: fit-content;
                margin: 3px 0;
                button {
                    margin-left: 3px;
                }
            }
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
                @media  screen and (max-width: $breakpointMax-mobile) {
                    margin-right: 10px;
                }
            }
            &--small {
                height: 25px;
                width: 35px;
                background-color: $color--mca-secondary;
                border: 1px groove $color--mca-secondary;
                position: relative;
                cursor: pointer;
            }
            img {
                position: absolute;
                height: 20px;
                width: 20px;
                top: 7px;
                left: 7px;
            }
        }
        &_weapon-line {
            align-items: center;
            align-content: center;
            display: flex;
            justify-content: space-evenly;
            height: fit-content;
            padding: 3px;
            @media screen and (max-width: $breakpointMax-mobile) {
                flex-wrap: wrap;
            }
        }
    }

    .checkbox-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        max-width: 100%;
        @media screen and (max-width: $breakpointMax-mobile) {
            margin-top: 10px;
            max-width: 60%;
        }
    }   

    .checkbox-item {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .printable {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        display: none;
    }
    // @media print {
    //     .ps {
    //         width: 100% !important;
    //         break-inside: avoid;
    //         page-break-inside: avoid;            
    //     }
    // }
    @media print {
    .ps {
        width: 300px !important; // ou la largeur qui te convient
        margin: 0 auto !important; // centrage horizontal
        break-inside: avoid;
        page-break-inside: avoid;
        box-sizing: border-box;
    }
}


</style>