<script setup>
const props = defineProps({
  title: String
})
</script>

<template>
  <header class="mca-header">
    <h1 class="mca-header__title">Mars Code Aurora : constructeur d'escouade</h1>
    <div class="mca-header__wrapper">
      <div class="mca-header__bar">
        <router-link to="/factions" class="mca-header__logo-link">
          <img
            src="/img/triangle.svg"
            class="mca-header__logo"
            alt="Logo"
          />
        </router-link>

        <div class="mca-header__banner">
          <p class="mca-header__headline">{{ title }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
    @use "../assets/style/variables.scss" as *;
    .mca-header {
        &__title {
            font-family: "Exo 2", system-ui, sans-serif;
            font-weight: 600;
            font-size: 24px;
            color: $color--mca-red;
            text-align: center;
            margin: 0;
        }

        &__wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color: $color--light;
            width: 100%;
            box-sizing: border-box;
            padding: 20px 0 0 0;
        }

        &__bar {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 98vw;
        }

        &__logo-link { text-decoration: none; }

        &__logo {
            width: 70px;
            height: auto;
            display: block;
        }

        &__banner {
            background-image: url("/img/band.svg");
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 70px;
            padding: 0 20px;
            width: 100vw;
        }

        &__headline {
            margin: 0;
            font-size: 16px;
            color: $color--light
        }
    }
</style>
