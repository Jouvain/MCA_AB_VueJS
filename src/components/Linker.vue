<script setup>
    const props = defineProps({ to: { type: [String, Object], required: true } })
</script>

<template>
    <RouterLink :to="to"><slot /></RouterLink>
</template>
