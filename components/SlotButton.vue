<template>
  <UButton @click="emit('reserve', slot)" :disabled="slot.reserved">
    {{ slot.date }} - {{ slot.time }}
    <span v-if="slot.reserved">(Réservé)</span>
  </UButton>
</template>

<script setup>
defineProps(['slot'])
const emit = defineEmits(['reserve'])
</script>
