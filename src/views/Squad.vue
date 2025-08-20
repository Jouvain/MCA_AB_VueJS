<script setup>
    import Header from "../components/Header.vue"
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import { ref, computed, onMounted, onUnmounted } from "vue";
    import dataFactions from "../assets/armyBook.json";
    import Resume from "../components/Resume.vue";
    import html2pdf from "html2pdf.js";
    import Alert from "../components/Alert.vue";
    import ButtonMode from "../components/ButtonMode.vue";

    const printArea = ref(null);
    const route = useRoute();
    const currentSlug = route.params.slug;
    // const faction = dataFactions.factions.find(f => f.name === currentSlug);
    let faction = dataFactions.factions.find(f => f.name === currentSlug);

    if(faction?.name === 'Fortune') {
        // Fusionne tous les profils et spécialités des autres factions
        const allOtherFactions = dataFactions.factions.filter(f => f.name !== "Fortune");

        const combinedProfiles = allOtherFactions.flatMap(f => f.profiles || []);
        // const combinedSpecialties = allOtherFactions.flatMap(f => f.specialties || []);
        const combinedSpecialties = Array.from(
            new Set(
                allOtherFactions.flatMap(f => f.specialties || [])
            )
        );

        // On crée une version étendue de Fortune sans toucher au JSON source
        faction = {
            ...faction,
            profiles: combinedProfiles,
            specialties: combinedSpecialties
        };        
    }

    const mode = ref('Standard');

    function modifyMode(newMode) {
        mode.value = newMode;
    }

    const items = dataFactions.items;
    const squadName = ref('Escouade ' + faction.name)
    const squadCost = ref(0)
    const activePanel = ref("faction");
    const isMobile = ref(window.innerWidth <= 500);
    function updateIsMobile() {
        isMobile.value = window.innerWidth <= 500;
    }

    const modes = ['Blitz', 'Standard', 'Héroïque'];

    const squad = ref({
        name: 'Escouade anonyme',
        mode: 'STANDARD',
        profiles: []
    })

    const officerNb = computed(() => {
        return squad.value.profiles.reduce( (sum, p) => {
            let officers = 0;
            if(p.grade != null && p.grade != undefined) {
                p.grade > 0 ? officers += 1 : officers = officers;
            }
            
            return sum + officers;
        }, 0);
    });

    const costLimit = computed (() => {
        if(mode.value === 'Blitz') {
            return 15;
        } else if (mode.value === 'Standard') {
            return 25;
        } else {
            return 30;
        }
    });
    const officersLimit = computed (() => {
        if(mode.value === 'Blitz') {
            return 1;
        } else {
            return 3;
        }
    });
    const gradeLimit = computed(() => {
        if(mode.value === 'Blitz') {
            return 1;
        } else {
            return 3;
        }
    });

    const tooExpensive = computed (() => {
        return totalCost.value > costLimit.value;
    })

    const tooMuchOffciers = computed( () => {
        return officerNb.value > officersLimit.value;
    });

    const tooMuchGrades = computed(() => {
        return totalGrades.value > gradeLimit.value;
    });

    function addLightStructure(profile) {
        let newRule = " Structure légère";
        if (!profile.specialRule || profile.specialRule === null || profile.specialRule === undefined) {
            profile.specialRule = "";
        }
        if(!profile.specialRule.includes(newRule)) {
            profile.specialRule = profile.specialRule + newRule;   
            profile.endurance = profile.endurance - 4;
            profile.move = profile.move + 10;  
        }
    }

    const totalGrades = computed(() => {
        return squad.value.profiles.reduce((sum, p) => {
            return sum + p.grade;
        }, 0);
    });

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
        profile.oldWeapons = [...profile.weapons];
        profile.equipment = [];
        profile.oldSpecialRules = profile.specialRule;
        profile.oldEndurance = profile.endurance;
        profile.oldMove = profile.move;
        squad.value.profiles.push({...profile});
    }
    function removeProfile(index) {
        squad.value.profiles.splice(index, 1);
    }
    function resetProfile(profile) {
        profile.name = profile.archive;
        profile.weapons = [...profile.oldWeapons];
        profile.grade = 0;
        profile.specialRoles = [];
        profile.equipment = [];
        profile.specialRule = profile.oldSpecialRules;
        profile.endurance = profile.oldEndurance;
        profile.move = profile.oldMove;
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
            const isSVG = img.src.endsWith(".svg") || img.src.includes(".svg");

            if (isSVG) {
                // Convertir en PNG via canvas
                promises.push(
                    new Promise(resolve => {
                        const svgImg = new Image();
                        svgImg.crossOrigin = "anonymous";
                        svgImg.src = img.src;

                        svgImg.onload = () => {
                            const canvas = document.createElement("canvas");
                            canvas.width = svgImg.width || 64;
                            canvas.height = svgImg.height || 64;
                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(svgImg, 0, 0);

                            // Remplacer le src de l'image originale par un PNG base64
                            img.src = canvas.toDataURL("image/png");
                            resolve();
                        };

                        svgImg.onerror = () => {
                            console.warn("Échec de chargement SVG :", img.src);
                            resolve();
                        };
                    })
                );
            } else if (!img.complete) {
                // Image classique, attendre son chargement
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

</script>

<template>
    
        <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>

        <Alert :too-expensive="tooExpensive" :too-much-offciers="tooMuchOffciers" :too-much-grades="tooMuchGrades" />

        <div class="squad_modes">
            <div v-for="modeItem in modes" class="squad_mode">
                <ButtonMode :mode="modeItem" class="squad_button" :class="{'squad_button--active' : mode === modeItem}" @mode="modifyMode" />
            </div>
        </div>

        <Resume v-model:squadName="squadName" :squad-cost="totalCost" :squad-officer-nb="officerNb" :chosen-mode="mode" />

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
                    <ProfileSheet :profile="profile"  mode="edit" @delete="removeProfile(i)" :roles="faction.specialties" @reset="resetProfile(profile)" @lighter="addLightStructure(profile)" :items="items" />
                </div>
            </div>
        </section>




        <div ref="printArea" class="printable">
            <Resume v-model:squadName="squadName" :squad-cost="totalCost" :squad-officer-nb="officerNb" :chosen-mode="mode" />
            <!-- <div class="panels_wrapper" v-show="!isMobile || activePanel === 'roster' " > -->
                <div v-for="(profile, i) in squad.profiles" :key="i" class="gallery_block">
                    <ProfileSheet :profile="profile"  mode="" @delete="removeProfile(i)" :roles="faction.specialties" @reset="resetProfile(profile)" :items="items" />
                    <p> *** </p>
                        <!-- Spacer forcé toutes les 3 cartes -->
                        <div v-if="(i + 1) % 3 === 0" class="force-break"></div>
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
        .gallery_block {
            break-inside: avoid;
            page-break-inside: avoid;
        }

    }

    .printable {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        display: none;
    }
    .force-break {
        display: block;
        page-break-before: always;
        height: 100px; /* nécessaire pour que html2canvas le prenne en compte */
        visibility: hidden;
    }   
    
    .squad {
        &_modes {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: $spacing;
        }
        &_button {
            background-color: $color--mca-tertiary;
            color: $color--mca-red;
            border: none;
            border-radius: 30px;
            padding: 10px;
            width: 100px;
            cursor: pointer;
            &--active {
                background-color: $color--mca-red;
                color: $color--light;
                font-weight: bold;
            }
        }
    }


</style>