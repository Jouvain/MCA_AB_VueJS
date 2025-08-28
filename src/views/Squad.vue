<script setup>
    /**
    * @view Squad
    * @description
    * Vue principale pour composer une escouade à partir des profils d’une faction.
    *
    * Fonctionnalités principales :
    * - Récupère la faction courante via le `slug` de la route.
    * - Permet d’ajouter/retirer des profils et de modifier leurs propriétés (grades, équipements, rôles spéciaux).
    * - Calcule automatiquement le coût total de l’escouade et applique des contraintes selon le mode de jeu.
    * - Affiche des alertes (trop de grades, officiers, blindés, etc.).
    * - Propose différents modes de partie (Blitz, Standard, Héroïque).
    * - Gère la responsivité (vue mobile avec bascule Faction / Escouade).
    * - Génère un PDF imprimable de l’escouade (via `html2pdf.js`).
    *
    * Cas particuliers :
    * - Faction **Fortune** : fusionne tous les profils et spécialités des autres factions.
    * - Faction **Égalité** : double automatiquement certains profils ("Igualdad Soldado").
    * - Faction **Domination** : limite des officiers spécifique.
    */

    /* 
    ***********
    * IMPORTS *
    ***********
    */

    import Header from "../components/Header.vue"
    import ProfileSheet from "../components/ProfileSheet.vue";
    import { useRoute } from "vue-router";
    import { ref, computed, onMounted, onUnmounted } from "vue";
    import dataFactions from "../assets/armyBook.json";
    import Resume from "../components/Resume.vue";
    import html2pdf from "html2pdf.js";
    import Alert from "../components/Alert.vue";
    import ButtonMode from "../components/ButtonMode.vue";
    import Captain from "../components/Captain.vue";
    import SpecialRules from "../components/SpecialRules.vue";

    /*
    ****************************
    * ROUTE ET DONNEES DE BASE *
    ****************************
    */

    /**
    * Paramètre de route : slug de la faction choisie.
    * @type {string}
    */
    const route = useRoute();
    /**
    * Slug actualisé via le slug enregistré dans la route
    * @type {string}
    */
    const currentSlug = route.params.slug;

    /**
    * Faction courante, enrichie selon règles spéciales (Fortune, etc.).
    * @type {Object}
    */
    let faction = dataFactions.factions.find(f => f.name === currentSlug);


    if(faction?.name === 'Fortune') {
        const allOtherFactions = dataFactions.factions.filter(f => f.name !== "Fortune");
        const combinedProfiles = allOtherFactions.flatMap(f =>
            (f.profiles || []).map(p => ({
                ...p, // clone
                originalFaction: f.name // ajout du champ
            }))
        );
        const combinedSpecialties = Array.from(
            new Set(
                allOtherFactions.flatMap(f => f.specialties || [])
            )
        );

        faction = {
            ...faction,
            profiles: combinedProfiles,
            specialties: combinedSpecialties
        };        
    }

    /**
     * Liste des équipements attribuables à un combattant
     * @type {array}
     */
    const items = dataFactions.items;


    

    /*
    ***********************
    * VARIABLES REACTIVES *
    ***********************
    */

    // ********** Gestion MODE DE JEU **********
    /**
    * Mode de jeu courant (Blitz, Standard, Héroïque).
    * @type {import("vue").Ref<string>}
    */    
    const mode = ref('Standard');
    /** Modifie le mode de jeu courant. */
    function modifyMode(newMode) {
        mode.value = newMode;
    }
    /**
     * Modes de jeu possibles
     * @type {array de strings}
     */
    const modes = ['Blitz', 'Standard', 'Héroïque'];

    // ********* Gestion IMPRESSION PDF *********
    /**
    * Référence au DOM pour l’impression PDF.
    * @type {import("vue").Ref<HTMLElement|null>}
    */
    const printArea = ref(null);
    /**
     * État "pour impression".
     * @type {import("vue").Ref<boolean>}
     */
    const isForPrint = ref(true);

    // ********* Gestion de l'ESCOUADE *********
    /**
    * Nom affiché de l’escouade.
    * @type {import("vue").Ref<string>}
    */
    const squadName = ref('Escouade ' + faction.name)
    /**
    * Escouade en cours de composition.
    * @type {import("vue").Ref<{name:string, mode:string, profiles:Object[]}>}
    */    
    const squad = ref({
        name: 'Escouade anonyme',
        mode: 'STANDARD',
        profiles: []
    })


    // ********** Gestion RESPONSIVE *********
    /**
    * En version mobile, quelle roster (la faction ou l'escouade) est actif/visible 
    */
    const activePanel = ref("faction");
    /**
    * Indique si on est en affichage mobile.
    * @type {import("vue").Ref<boolean>}
    */    
    const isMobile = ref(window.innerWidth <= 500);
    function updateIsMobile() {
        isMobile.value = window.innerWidth <= 500;
    }


    // ********** Gestion des RECENSEMENTS ********
    /**
    * Nombre total d’officiers.
    */
    const officerNb = computed(() => {
        return squad.value.profiles.reduce( (sum, p) => {
            let officers = 0;
            if(p.grade != null && p.grade != undefined) {
                p.grade > 0 ? officers += 1 : officers = officers;
            }
            
            return sum + officers;
        }, 0);
    });
    /**
    * Nombre total de blindés.
    */
    const blindesNb = computed(() => {
        return squad.value.profiles.reduce((sum, p) => {
            let blindes = 0;
            if(p.type === 'blindé') {
                blindes += 1;
            }
            return sum + blindes;
        }, 0);
    });
    /**
     * Niveaux cumulés des grades
     * @type {number}
     */
    const totalGrades = computed(() => {
        return squad.value.profiles.reduce((sum, p) => {
            return sum + p.grade;
        }, 0);
    });
        /**
     * Profil du Capitaine
     * @type {profile}
     */
    const captain = computed(() => {
        let foundCaptain = squad.value.profiles.find(p => p.isCaptain === true);
        return foundCaptain;
    });
    /**
     * Nombre de capitaines (1 ou 0)
     */
    const captainNb = computed(() => {
        let captains = 0;
        return squad.value.profiles.reduce((sum, p) => {
            if(p.isCaptain != null && p.isCaptain === true) {
                captains += 1;
            }
            return sum + captains;
        }, 0);
    });
    /**
    * Coût total de l’escouade incluant profils, grades, rôles spéciaux et équipements.
    */
    const totalCost = computed(() => {
        // return squad.value.profiles.reduce((sum, p) => sum + p.cost, 0);
        return squad.value.profiles.reduce( (sum, p) => {
            let specialCost;
            p.specialRoles.length > 0 ? specialCost = 1 : specialCost = 0;
            if(p.specialRule != null && p.specialRule.includes('Héroïque')) {
                specialCost += 1;
            }
            if(p.meleeHeroe != null && p.meleeHeroe === true) {
                specialCost += 1;
            }
            if(faction.name === 'Fortune' && p.name.includes("avec")) {
                specialCost += 1;
            }
            const gradeCost = p.grade ?? 0;
            return sum + p.cost + gradeCost + specialCost;
        }, 0) + getEquipmentCost();
    });


    // ********* Gestion des LIMITES pour alerte *********
    /**
    * Contraintes calculées dynamiquement :
    * - Limite de coût selon le mode
    */    
    const costLimit = computed (() => {
        if(mode.value === 'Blitz') {
            return 15;
        } else if (mode.value === 'Standard') {
            return 25;
        } else {
            return 30;
        }
    });
    /**
    * Contraintes calculées dynamiquement :
    * - Limite d’officiers selon la faction ou le mode
    */  
    const officersLimit = computed (() => {
        if(mode.value === 'Blitz' || faction.name === 'Domination') {
            return 1;
        } else {
            return 3;
        }
    });
    /**
    * Contraintes calculées dynamiquement :
    * - Limite de grades selon le mode
    */  
    const gradeLimit = computed(() => {
        if(mode.value === 'Blitz') {
            return 1;
        } else {
            return 100;
        }
    });
    /**
    * Contraintes calculées dynamiquement :
    * - Limite de blindés selon le mode
    */  
    const blindesLimit = computed(() => {
        if(mode.value === 'Blitz') {
            return 0;
        } else {
            return 100;
        }
    });
    /**
     * Contraintes calculées dynamiquement :
     * - Limite en coût d'Igualdad Soldados avec l'Égalité
     */
    const igualdadCostLimit = computed(() => {
        return totalCost.value / 2;
    });
    /**
     * Coût dynamique cumulé en soldats Igualdad
     */
    const igualdadCost = computed(() => {
        return squad.value.profiles.reduce((sum, p) => {
            if(p.name.includes("Igualdad")) {
                return sum + p.cost;
            }
        }, 0);
    });

    // *********** Gestion des DEPASSEMENTS DE LIMITE **********
    /**
     * Dépassement en coût d'Igualdad
     * @type {boolean}
     */
    const tooMuchIgualdadCost = computed(() => {
        return igualdadCost.value > igualdadCostLimit.value;
    });
    /**
     * Dépassement en nombre de blindés
     * @type {boolean}
     */
    const tooMuchBlindes = computed(() => {
        return blindesNb.value > blindesLimit.value;
    });
    /**
     * Dépassement en coût total
     * @type {boolean}
     */
    const tooExpensive = computed (() => {
        return totalCost.value > costLimit.value;
    })
    /**
     * Dépassement en nombre d'officiers
     * @type {boolean}
     */
    const tooMuchOffciers = computed( () => {
        return officerNb.value > officersLimit.value;
    });
    /**
     * Dépassement en niveaux cumulés de grade
     * @type {boolean}
     */
    const tooMuchGrades = computed(() => {
        return totalGrades.value > gradeLimit.value;
    });


    // ********* Gestion des FILTRES pour la FORTUNE **********
    /**
     * Liste de factions d'origine SI faction en Fortune
     */
    const originalFactionsCalcul = computed(()  => {
        if(faction.name === 'Fortune') {
            let uniqueFactions = new Set();
            faction.profiles.forEach(profile => {
                uniqueFactions.add(profile.originalFaction);
            })
            return uniqueFactions;
        } else {
            return []
        }
    });

    const chosenOriginalFaction = ref(null);
    
    /**
     * Attribue une "faction choisie" pour filtrer les profils 
    */
    function modifyChosenFaction(newFaction) {
        if(chosenOriginalFaction.value === newFaction) {
            chosenOriginalFaction.value = null;
        } else {
            chosenOriginalFaction.value = newFaction;
        }
    }

    /**
     * Liste de profils disponibles en fonction de FORTUNE
     * @type {array}
    */
    const filteredProfiles = computed(() => {
        if (!chosenOriginalFaction.value) return faction.profiles;
        return faction.profiles.filter(
            p => p.originalFaction === chosenOriginalFaction.value
        );
    });

    /*
    ********************
    * FONCTIONS METIER *
    ********************
    */

    /** Attribue la règle "Héroïque" à un profil. */
    function becomeHeroe(profile) {
        let newRule = " Héroïque";
        if (!profile.specialRule || profile.specialRule === null || profile.specialRule === undefined) {
            profile.specialRule = "";
        }
        if(!profile.specialRule.includes(newRule)) {
            profile.specialRule = profile.specialRule + newRule;   
        }        
    }
    /** Attribue le rôle de Capitaine à un profil */
    function becomeCaptain(profile) {
        profile.isCaptain = true;
    }
    /** 
     * Fait d'un profil "Héroïque" un expert en mêlée :
     * - SOIT en obtenant une arme de mêlée
     * - SOIT en devenant Brutal s'il est déjà armé
     * - !! S'il est déjà armé et Brutal, il ne se passe rien !!
     */
    function becomeMeleeHeroe(profile) {
        if(profile.meleeHeroe != null && profile.meleeHeroe === true) {
            return;
        }
        if(profile.specialRule != null && profile.specialRule.includes('brutal')) {
            return;
        }
        profile.meleeHeroe = true;
        let isArmed = false;
        profile.weapons.forEach(w => {
            if(w.Longueur === 0) {
                isArmed = true;
            }
        });
        if(!isArmed) {
            profile.weapons.push({name : 'Arme de mêlée', Longueur: 0, Rafale: 0, Puissance: 7});
        } else {
            let newRule = " brutal";
            if(!profile.specialRule || profile.specialRule === null || profile.specialRule === undefined) {
                profile.specialRule = "";
            }
            profile.specialRule = profile.specialRule + newRule
        }
    }
    /** Attribue la règle Structure Légère et modifie le profil d'un Blindé */
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
    /** Ajoute le profil à la liste de profil de l'escouade */
    function addProfile(profile, oneShot = false) {
        profile.archive = profile.name;
        profile.oldWeapons = [...profile.weapons];
        profile.equipment = [];
        if(profile.specialRule != null) {
            profile.oldSpecialRules = [...profile.specialRule];
        }
        profile.oldEndurance = profile.endurance;
        profile.oldMove = profile.move;

        squad.value.profiles.push(JSON.parse(JSON.stringify(profile)));
        
        if(faction.name === 'Égalité' && profile.name.includes('Igualdad Soldado') && oneShot === false) {
            addProfile(profile, true);
        }
        if(oneShot === true) {
            const lastProfile = squad.value.profiles[squad.value.profiles.length - 1];
            lastProfile.cost -= 1;
        }
        if(profile.specialRule != null && profile.specialRule.includes("Poste mobile")) {
            const lastProfile = squad.value.profiles[squad.value.profiles.length - 1];
            lastProfile.grade = lastProfile.rank;
        }      
    }
    /** Retire le profil indexé de la liste de profils de l'escouade */
    function removeProfile(index) {
        squad.value.profiles.splice(index, 1);
    }
    /** Réinitialise le profil, redonne les propriétés originelles */
    function resetProfile(profile) {
        profile.name = profile.archive;
        profile.weapons = [...profile.oldWeapons];
        profile.grade = 0;
        profile.specialRoles = [];
        profile.equipment = [];
        profile.specialRule = profile.oldSpecialRules;
        profile.endurance = profile.oldEndurance;
        profile.move = profile.oldMove;
        profile.meleeHeroe = null;
    }
    /** Calcule le coût en équipement global sur l'Escouade */
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


    /*
    *********************************
    * HOOKS VueJS sur CYCLES DE VIE *
    *********************************
    */
    onMounted(() => {
        window.addEventListener('resize', updateIsMobile);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateIsMobile);
    });


    /*
    ******************
    * IMPRESSION PDF *
    ******************
    */

    /**
     * Précharge toutes les images (y compris SVG → PNG) pour éviter
     * les erreurs de rendu avant export PDF.
     */
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

    /** Génère le PDF de l’escouade avec `html2pdf.js`. */
    async function print() {
        const element = printArea.value;
        if (!element) return;
        element.style.display = "block";
        await preloadImages(element); // 👈 attend que toutes les images soient chargées
        const opt = {
            margin: 0.5,
            filename: squad.value.name + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                logging: true,
                useCORS: true,
                allowTaint: true,
                letterRendering: true, // améliore le rendu du texte
            },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
        };
        html2pdf().set(opt).from(element).save().then(() => {
            element.style.display = "none";
        });
    }

</script>

<template>
        <div class="sticky-intel">
            <Header :title="faction ? faction.name : 'Faction inconnue'"></Header>

            <Alert v-bind:too-much-igualdad="tooMuchIgualdadCost" :too-expensive="tooExpensive" :too-much-offciers="tooMuchOffciers" :too-much-grades="tooMuchGrades" :too-much-blindes="tooMuchBlindes" />

            <div class="squad_modes">
                <div v-for="modeItem in modes" class="squad_mode">
                    <ButtonMode :mode="modeItem" class="squad_button" :class="{'squad_button--active' : mode === modeItem}" @mode="modifyMode" />
                </div>
            </div>

            <Resume v-model:squadName="squadName" :faction="faction.name" :squad-cost="totalCost" :squad-officer-nb="officerNb" :chosen-mode="mode" />
            <Captain v-if="captain != null" :captain="captain" />


            <div class="squad_actions">
                <div class="print">
                    <button class="print_btn" @click="print">&#x1F5A8</button>
                </div>

                <div class="mobile-toggle" v-if="isMobile">
                    <button @click="activePanel = (activePanel === 'faction' ? 'roster' : 'faction')">
                        {{ activePanel === 'faction' ? '→ Escouade' : '← Faction' }}
                    </button>
                </div>
            </div>


            <div v-if="faction.name === 'Fortune'" class="squad_modes squad_modes--filters">
                <div v-for="originalFaction in originalFactionsCalcul" class="squad_mode">
                    <ButtonMode :mode="originalFaction" class="squad_button" :class="{'squad_button--active' : chosenOriginalFaction === originalFaction}" @mode="modifyChosenFaction" />
                </div>
            </div>
        </div>

        



        <section class="panels">
            <div class="panels_wrapper" v-show="!isMobile || activePanel === 'faction' ">
                <div v-for="(profile, i) in filteredProfiles" :key="i" class="gallery_block">
                    <ProfileSheet :profile="profile"  mode="add" @add="addProfile(profile)"/>
                </div>
            </div>
            <div class="panels_wrapper" v-show="!isMobile || activePanel === 'roster' " >
                <div v-for="(profile, i) in squad.profiles" :key="i" class="gallery_block">
                    <ProfileSheet :faction="faction.name" :captain-nb="captainNb" :profile="profile"  mode="edit" @delete="removeProfile(i)" :roles="faction.specialties" @reset="resetProfile(profile)" @lighter="addLightStructure(profile)" @heroe="becomeHeroe(profile)"  @melee="becomeMeleeHeroe(profile)" @captain="becomeCaptain(profile)" :items="items" :battle-mode="mode" />
                </div>
            </div>
        </section>


        <div ref="printArea" class="printable">
        <div class="printable-container">
            <Resume 
                class="print-header"                       
                v-model:squadName="squadName"
                :faction="faction.name"
                :is-for-print="isForPrint"
                :squad-cost="totalCost"
                :squad-officer-nb="officerNb"
                :chosen-mode="mode"
            />
            <Captain v-if="captain != null" :captain="captain" :is-for-print="isForPrint" />

            <SpecialRules :faction="faction" />

            <div class="print-separator"></div>         <!-- 👈 -->

            <div v-for="(profile, i) in squad.profiles" :key="i" class="gallery_block">
            <ProfileSheet :profile="profile" mode="" :roles="faction.specialties" :items="items" :faction="faction.name" />
            </div>
        </div>
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

    /* Zone impression simple: pas de flex ici */
    .printable { display: none; }
    .printable-container {
    display: block !important;
    max-width: 800px;         /* largeur de colonne imprimée */
    width: 100%;
    margin: 0 auto;           /* 👈 centre horizontalement toute la colonne */
    padding: 20px;
    box-sizing: border-box;
    }


    /* Le header ne doit JAMAIS être coupé ni “compressé” */
    .print-header {              /* le composant Resume dans la zone print */
    display: block !important;
    text-align: center;        /* centrage du titre */
    margin: 0 0 16px 0;
    break-inside: avoid;
    page-break-inside: avoid;
    }

    /* Mise en ligne compacte uniquement pour l’impression */
    .print-header .resume_display {
    display: inline-flex;      /* 👈 petit flex localisé = ok pour html2pdf */
    gap: 20px;
    align-items: baseline;
    justify-content: center;
    width: auto;
    text-align: left;          /* le texte à l’intérieur du flex */
    }

    .print-header .resume_costs {
    display: inline-flex;      /* “Coût” et “Officiers” sur la même ligne */
    gap: 20px;
    margin-top: 0;
    }


    /* Petit séparateur visible pour html2canvas (évite les collages) */
    .print-separator { height: 12px; }

    /* Chaque carte ne doit pas se casser ni remonter sous un élément précédent */
    .gallery_block {
    display: block;
    margin: 0 0 20px 0;
    break-inside: avoid;
    page-break-inside: avoid;
    }

    /* centre le contenu quel que soit le markup interne du ProfileSheet */
    .gallery_block > * {
    display: inline-block;     /* pour que text-align centre l’élément */
    margin: 0 auto !important; /* sécurité si l’élément a une largeur fixe */
    }
    .printable-container { text-align: center; } /* centre les inline-block */


    /* Classe html2pdf pour forcer un saut si besoin
    (tu peux l'insérer entre éléments quand tu le souhaites) */
    .html2pdf__page-break {
    height: 0;
    break-before: page;
    page-break-before: always;
    }

    @media print {
    .mobile-toggle, .panels_wrapper:first-child, .print { display: none !important; }
    }


    
    .squad {
        &_modes {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: $spacing;
            &--filters {
                justify-content: center;
                gap: $spacing;
                border-top: 2px solid $color--mca-red;
                border-bottom: 2px solid $color--mca-red;
                padding: $spacing 0;
                @media screen and (max-width: $breakpointMax-mobile) {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    gap: 0;
                    padding: 5px 20px;
                    margin-top: 0;
                }
            }
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
            @media screen and (max-width: $breakpointMax-mobile) {
                width: 90px;
            }
        }
        &_actions {
            @media screen and (max-width:$breakpointMax-mobile) {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                button {
                    height: 50px;
                }
            }
        }
    }
    .sticky-intel {
        position: sticky;
        top: 0;
        z-index: 100;
        background: $color--light;
        // padding-bottom: $spacing;
    }


</style>