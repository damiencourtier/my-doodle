<template>
  <UContainer class="py-12 mx-auto">
    <UCard class="space-y-6 w-2xl mx-auto">
      <template #header>
        <h1 class="text-3xl font-semibold text-center">Créer un événement</h1>
      </template>

      <UForm :state="form" class="space-y-5">
        <UFormField label="Nom de l'événement" required>
          <UInput v-model="form.name" placeholder="Ex: Réunion d'équipe" class="w-full" />
        </UFormField>

        <UFormField label="Description" required>
          <UTextarea v-model="form.description" placeholder="Ex: Choisissez un créneau pour notre réunion hebdomadaire"
            :rows="3" class="w-full" />
        </UFormField>

        <p class="text-sm mb-2 font-medium">Choisissez les jours disponibles</p>
          <div class="flex flex-col sm:flex-row gap-6">
            <UCalendar v-model="selectedDates" :is-date-disabled="isDateDisabled" multiple class="w-full sm:w-1/2" locale="fr" />
            <div v-if="selectedDates.length" class="w-full sm:w-1/2">
              <p class="font-medium mb-3">Jours sélectionnés :</p>
              <div class="flex flex-wrap gap-2">
              <UBadge v-for="(date, index) in sortedDates" :key="index" color="neutral" variant="subtle"
                class="rounded-full">
                {{ formatDate(date) }}
              </UBadge>
              </div>
            </div>
          </div>
        


        <UButton @click="submitForm" :disabled="!form.name || selectedDates.length === 0" color="primary">
          Créer l'événement
        </UButton>
      </UForm>
    </UCard>
  </UContainer>

</template>

<script setup>

import slugify from 'slugify'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const form = ref({
  name: '',
  description: '',
  slots: []
})

const selectedDates = ref([])

const sortedDates = computed(() =>
  [...selectedDates.value].sort((a, b) => new Date(a) - new Date(b))
)

watch(selectedDates, (newDates) => {
  if (!Array.isArray(newDates)) {
    selectedDates.value = [];
  }
});

const formatDate = (date) => format(date, 'dd/MM/yyyy', { locale: fr })

const isDateDisabled = (date) => {
  const today = new Date();
  const selectedDate = new Date(date);
  return (
    selectedDate < today
  );
}

function submitForm() {
  const slug = slugify(form.value.name, { lower: true })
  const eventData = {
    ...form.value,
    slug,
    slots: selectedDates.value.map(date => ({
      date: format(date, 'yyyy-MM-dd'),
    })),
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem(`event-${slug}`, JSON.stringify(eventData))
  navigateTo(`/event/${slug}`)
}

</script>