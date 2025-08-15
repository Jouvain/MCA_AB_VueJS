<script setup>
    import Header from "../components/Header.vue"
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import { ref, computed } from "vue";
    import dataFactions from "../assets/armyBook.json";
import Resume from "../components/Resume.vue";
    
    const route = useRoute();
    const currentSlug = route.params.slug;
    const faction = dataFactions.factions.find(f => f.name === currentSlug);

    const squad = ref({
        name: 'Escouade anonyme',
        mode: 'STANDARD',
        profiles: []
    })

    const totalCost = computed(() => {
        // return squad.value.profiles.reduce((sum, p) => sum + p.cost, 0);
        return squad.value.profiles.reduce( (sum, p) => {
            const gradeCost = p.grade ?? 0;
            return sum + p.cost + gradeCost;
        }, 0);
    });

    function addProfile(profile) {
        profile.archive = profile.name;
        squad.value.profiles.push({...profile});
    }
    function removeProfile(index) {
        squad.value.profiles.splice(index, 1);
    }
    function resetProfile(profile) {
        profile.name = profile.archive;
        profile.grade = 0;
        profile.specialRoles = [];
    }
    function modifySquadname(newName) {
        squad.value.name = newName;
    }

    const squadName = ref('Escouade Alpha')
    const squadCost = ref(0)



</script>

<template>
    <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>

    <Resume v-model:squadName="squadName" :squad-cost="totalCost" />


    <section class="panels">
        <div class="panels_wrapper">
            <div v-for="(profile, i) in faction.profiles" :key="i" class="gallery_block">
                <ProfileSheet :profile="profile"  mode="add" @add="addProfile(profile)"/>
            </div>
        </div>
        <div class="panels_wrapper">
            <div v-for="(profile, i) in squad.profiles" :key="i" class="gallery_block">
                <ProfileSheet :profile="profile"  mode="edit" @delete="removeProfile(i)" :roles="faction.specialties" @reset="resetProfile(profile)"/>
            </div>
        </div>
    </section>

</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
    .panels {
        display: flex;
        flex-direction: row;
        &_wrapper {
            width: 49%;
            align-items: center;
            padding: $spacing;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            div {
                margin: $spacing auto;
                width: 100%;
                align-items: center;
                display: flex;
                justify-content: center;
            }
        }   
    }
</style>