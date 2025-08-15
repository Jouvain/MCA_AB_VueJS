<script setup>
    import Header from "../components/Header.vue"
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import { ref, computed, onMounted, onUnmounted } from "vue";
    import dataFactions from "../assets/armyBook.json";
    import Resume from "../components/Resume.vue";
    import html2pdf from "html2pdf.js";

    const printArea = ref(null);
    const route = useRoute();
    const currentSlug = route.params.slug;
    const faction = dataFactions.factions.find(f => f.name === currentSlug);
    const items = dataFactions.items;
    const squadName = ref('Escouade ' + faction.name)
    const squadCost = ref(0)
    const activePanel = ref("faction");
    const isMobile = ref(window.innerWidth <= 500);
    function updateIsMobile() {
        isMobile.value = window.innerWidth <= 500;
    }

    const squad = ref({
        name: 'Escouade anonyme',
        mode: 'STANDARD',
        profiles: []
    })

    const totalCost = computed(() => {
        // return squad.value.profiles.reduce((sum, p) => sum + p.cost, 0);
        return squad.value.profiles.reduce( (sum, p) => {
            let specialCost;
            p.specialRoles.length > 0 ? specialCost = 1 : specialCost = 0;
            const gradeCost = p.grade ?? 0;
            return sum + p.cost + gradeCost + specialCost;
        }, 0) + getEquipmentCost();
    });

    function addProfile(profile) {
        profile.archive = profile.name;
        profile.equipment = [];
        squad.value.profiles.push({...profile});
    }
    function removeProfile(index) {
        squad.value.profiles.splice(index, 1);
    }
    function resetProfile(profile) {
        profile.name = profile.archive;
        profile.grade = 0;
        profile.specialRoles = [];
        profile.equipment = [];
    }
    function modifySquadname(newName) {
        squad.value.name = newName;
    }

    function getEquipmentCost() {
        let points = 0;
        let distributed = 0;

        squad.value.profiles.forEach( p => {
            const count = p.equipment?.length ?? 0;
            const rank = p.rank ?? 1;

            if(count > 0) {
                if(rank === 1) {
                    distributed += count / 3;
                } else if (rank === 2) {
                    distributed += count / 2;
                } else {
                    distributed += count / 1;
                }
            }
        });

        points = Math.ceil(distributed);
        return points;
    }

    onMounted(() => {
        window.addEventListener('resize', updateIsMobile);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateIsMobile);
    });

    function preloadImages(element) {
        const images = element.querySelectorAll("img");
        const promises = [];

        images.forEach(img => {
            if (!img.complete) {
                promises.push(
                    new Promise(resolve => {
                        img.onload = img.onerror = resolve;
                    })
                );
            }
        });

        return Promise.all(promises);
    }

    async function print() {
        const element = printArea.value;
        if (!element) return;

        element.style.display = "block";

        await preloadImages(element); // 👈 attend que toutes les images soient chargées

        const opt = {
            margin: 0.2,
            filename: squad.value.name + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            element.style.display = "none";
        });
    }


    // function print () {
    //     const element = printArea.value;
    //     if(!element) return;

    //     element.style.display = "block";

    //     const opt = {
    //         margin: 0.2,
    //         filename: squad.value.name + '.pdf',
    //         image: {type: 'jpeg', quality: 0.98},
    //         html2canvas: {scale: 2},
    //         jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    //     };

    //     html2pdf().set(opt).from(element).save().then( () => {
    //         element.style.display = "none";
    //     });
    // }


</script>

<template>
    
        <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>

        <Resume v-model:squadName="squadName" :squad-cost="totalCost" />
        <div class="print">
            <button class="print_btn" @click="print">&#x1F5A8</button>
        </div>


        <div class="mobile-toggle" v-if="isMobile">
            <button @click="activePanel = (activePanel === 'faction' ? 'roster' : 'faction')">
                {{ activePanel === 'faction' ? '→ Escouade' : '← Faction' }}
            </button>
        </div>

        <section class="panels">
            <div class="panels_wrapper" v-show="!isMobile || activePanel === 'faction' ">
                <div v-for="(profile, i) in faction.profiles" :key="i" class="gallery_block">
                    <ProfileSheet :profile="profile"  mode="add" @add="addProfile(profile)"/>
                </div>
            </div>
            <div class="panels_wrapper" v-show="!isMobile || activePanel === 'roster' " >
                <div v-for="(profile, i) in squad.profiles" :key="i" class="gallery_block">
                    <ProfileSheet :profile="profile"  mode="edit" @delete="removeProfile(i)" :roles="faction.specialties" @reset="resetProfile(profile)" :items="items" />
                </div>
            </div>
        </section>




        <div ref="printArea" class="printable">
            <Resume v-model:squadName="squadName" :squad-cost="totalCost" />
            <!-- <div class="panels_wrapper" v-show="!isMobile || activePanel === 'roster' " > -->
                <div v-for="(profile, i) in squad.profiles" :key="i" class="gallery_block">
                    <ProfileSheet :profile="profile"  mode="edit" @delete="removeProfile(i)" :roles="faction.specialties" @reset="resetProfile(profile)" :items="items" />
                    <p> *** </p>
                </div>
            <!-- </div> -->
        </div>
    


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
    @media screen and (max-width: 500px) {
        .panels {
            flex-direction: column;
        }

        .panels_wrapper {
            width: 90%;
        }

        .mobile-toggle {
            display: flex;
            justify-content: center;
            margin: 1rem 0;

            button {
                padding: 0.5rem 1rem;
                background-color: $color--mca-red;
                color: white;
                border: none;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
    .print {
        display: flex;
        justify-content: center;
        margin: $spacing;
        &_btn {
            background-color: $color--mca-red;
            color: $color--light;
            border: none;
            padding: 5px;
            border-radius: 5px;
            width: 60px;
            font-size: xx-large;
            cursor: pointer;
        }
    }

    @media print {
        .mobile-toggle,
        .panels_wrapper:first-child,
        .print {
            display: none;
        }
        .panels_wrapper {
            width: 100%;
            flex-direction: column;
            div {
                width: 100%;
            }
        }
    }

    .printable {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        display: none;
    }


</style>