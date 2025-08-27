<script setup >

/**
 * @component Alert
 * @description
 * Composant d’alerte affichant les violations des règles de composition
 * d’une escouade (coût, officiers, grades, blindés, etc.).
 *
 * Fonctionnement :
 * - Le composant reçoit un ensemble de drapeaux booléens en props.
 * - Si au moins un drapeau est vrai, un bloc d’alerte est affiché.
 * - Chaque règle violée est affichée comme un détail dans l’alerte.
 *
 * Utilisation :
 * ```vue
 * <Alert
 *   :too-expensive="tooExpensive"
 *   :too-much-offciers="tooMuchOffciers"
 *   :too-much-grades="tooMuchGrades"
 *   :too-much-blindes="tooMuchBlindes"
 *   :too-much-igualdad="tooMuchIgualdad"
 * />
 * ```
 */

 /**
 * @prop {boolean} tooExpensive
 * Indique si l’escouade dépasse le nombre maximum de points autorisés.
 * @prop {boolean} tooMuchOffciers
 * Indique si l’escouade contient trop d’officiers par rapport à la limite.
 * @prop {boolean} tooMuchGrades
 * Indique si un officier a un grade trop élevé.
 * @prop {boolean} tooMuchBlindes
 * Indique si l’escouade contient trop de blindés (ou si interdits par le mode).
 * @prop {boolean} tooMuchIgualdad
 * Indique si l’escouade dépasse la limite de 50 % de profils "Igualdad".
 */

    const props = defineProps({
        tooExpensive: {type: Boolean},
        tooMuchOffciers: {type: Boolean},
        tooMuchGrades: {type: Boolean},
        tooMuchBlindes: {type: Boolean},
        tooMuchIgualdad: {type: Boolean}
    })
</script>

<template>
    <div v-if="tooExpensive || tooMuchOffciers || tooMuchGrades || tooMuchBlindes || tooMuchIgualdad" class="alert">
        <p class="alert_title">ALERTE</p>
        <div class="alert_details">
            <p v-if="tooExpensive" class="alert_detail"> (trop de Points d'Armée !) </p>
            <p v-if="tooMuchOffciers" class="alert_detail"> (trop d'Officiers !) </p>
            <p v-if="tooMuchGrades" class="alert_detail"> (L'officier est trop gradé !) </p>
            <p v-if="tooMuchBlindes" class="alert_detail">(Blindés interdits !)</p>
            <p v-if="tooMuchIgualdad" class="alert_detail"> (Pas plus de 50% d'Igualdads !) </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
    .alert {
        display: flex;
        flex-direction: column;
        align-items: center;
        &_title {
            color: $color--mca-red;
            font-weight: bold;
            font-size: larger;
        }
        &_details {
            display: flex;
            justify-content: center;
            @media screen and (max-width: $breakpointMax-mobile) {
                flex-direction: column;
                align-items: center;
            }
        }
        &_detail {
            margin: $spacing;
            margin-top: 0;
            font-weight: bold;
        }
    }
</style>