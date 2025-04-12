<template>
  <div v-if="booking">
    <p>Réservation confirmée !</p>
    <p>{{ booking.date }} - {{ booking.time }} est réservé pour vous.</p>
  </div>
</template>

<script setup>
const props = defineProps({
  booking: Object
});
</script>

<style scoped>
p {
  font-size: 18px;
  color: green;
}
</style>
