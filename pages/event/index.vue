<template>
    <UContainer class="py-12 mx-auto">
      <UCard class="space-y-6 w-2xl mx-auto">
        <template #header>
          <h1 class="text-3xl font-semibold text-center">Liste des événements</h1>
        </template>
  
        <div v-if="events.length" class="space-y-4">
          <div v-for="event in events" :key="event.slug" class="p-4 border rounded-lg shadow-sm">
            <h2 class="text-xl font-bold">{{ event.name }}</h2>
            <p class="text-gray-600">{{ event.description }}</p>
            <UButton :to="`/event/${event.slug}`" color="primary" class="mt-2">
              Voir l'événement
            </UButton>
          </div>
        </div>
  
        <div v-else class="text-center text-gray-500">
          <p>Aucun événement trouvé.</p>
        </div>
      </UCard>
    </UContainer>
  </template>
  
  <script setup>
  
  const events = ref([])
  
  onMounted(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('event-')) {
        const event = JSON.parse(localStorage.getItem(key))
        events.value.push(event)
      }
    }
  })
  </script>