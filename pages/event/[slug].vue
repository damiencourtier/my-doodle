<template>
  <UContainer class="py-12 mx-auto max-w-full lg:max-w-4xl">
    <UCard class="space-y-6 w-4xl mx-auto">

      <template #header>
        <h1 class="text-3xl font-semibold text-center">
          <template v-if="event">Planification de l'événement : {{ event.name }}</template>
          <template v-else>
            <USkeleton class="h-6 w-100 mx-auto" />
          </template>
        </h1>
      </template>

      <div v-if="event" class="overflow-x-auto">

        <div
          class="rounded-xl border border-neutral-500 bg-neutral-50 shadow-md mb-8 relative overflow-hidden w-full p-4">
          <p class="pb-4 text-sm text-center text-gray-700">Cet événement propose {{ totalSlots }} créneaux disponibles.
          </p>
          <p v-if="slotWithMostAvailability" class="text-center text-gray-700">
            <strong>Créneau le plus populaire :</strong>
            Le <span class="text-blue-600 font-semibold">{{ formatDate(slotWithMostAvailability.date, 'dd MMM')
            }}</span>
            avec <span class="text-blue-600 font-semibold">{{ slotWithMostAvailability.count }}</span> disponibilités.
          </p>

        </div>

        <table class="min-w-full border-collapse">
          <thead>
            <tr class="text-gray-700">
              <th class="w-32"></th>
              <th v-for="slot in paginatedSlots" :key="slot.date" class="text-center text-sm font-semibold pb-4">
                <div class="text-xs text-gray-500">{{ formatDay(slot.date) }}</div>
                <div class="text-lg font-bold text-blue-600">{{ formatDate(slot.date, 'dd MMM') }}</div>
                <div class="text-sm text-gray-500">Disponibilités : {{ availabilityBySlot[slot.date] || 0 }}</div>
              </th>
              <th class="w-10"></th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="event.users" v-for="(user, userIndex) in event.users" :key="userIndex"
              class="border-t border-gray-300">
              <td class="text-center font-medium text-gray-600 py-4">
                <UInput v-model="user.name" placeholder="Nom de l'utilisateur" />
              </td>
              <td v-for="slot in paginatedSlots" :key="slot.date" class="text-center py-4">
                <UCheckbox v-model="user.selectedSlots.find(selectedSlot => selectedSlot.date === slot.date).checked"
                  size="xl" class="w-5 h-5 mx-auto" />
              </td>
              <td class="text-center py-4">
                <UButton icon="i-lucide-trash-2" size="sm" color="error" variant="outline"
                  @click="removeUser(userIndex)">
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center mt-4">
          <UPagination v-model:page="currentPage" :items-per-page="slotsPerPage" :total="totalSlots" />
        </div>

        <div class="text-center mt-4">
          <UButton @click="addUser" color="primary">Ajouter un utilisateur</UButton>
        </div>
      </div>

      <div v-else class="text-center text-gray-500">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="text-gray-700">
              <th class="w-32"></th>
              <th v-for="i in 3" :key="'header-skeleton-' + i" class="pb-4">
                <USkeleton class="h-6 w-32" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-300">
              <td class="text-center py-4">
                <USkeleton class="h-6 w-25" />
              </td>
              <td v-for="i in 3" :key="'body-skeleton-' + i" class="text-center py-4">
                <USkeleton class="h-6 w-32" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const route = useRoute()
const slug = route.params.slug
const currentPage = ref(1)
const slotsPerPage = ref(5)
const totalSlots = ref(0)

const event = ref(null)

onMounted(() => {
  const stored = localStorage.getItem(`event-${slug}`)
  if (stored) {
    event.value = JSON.parse(stored)
    if (!event.value.users) {
      event.value.users = []
    }
    totalSlots.value = event.value.slots.length
  }
})

const paginatedSlots = computed(() => {

  if (!event.value?.slots) return []
  const start = (currentPage.value - 1) * slotsPerPage.value
  const end = start + slotsPerPage.value
  return event.value.slots.slice(start, end)
})

const availabilityBySlot = computed(() => {
  if (!event.value?.users || !event.value?.slots) return {}

  return event.value.slots.reduce((acc, slot) => {
    const count = event.value.users.filter(user =>
      user.selectedSlots.find(selectedSlot => selectedSlot.date === slot.date && selectedSlot.checked)
    ).length
    acc[slot.date] = count
    return acc
  }, {})
})

const slotWithMostAvailability = computed(() => {
  if (!availabilityBySlot.value || Object.keys(availabilityBySlot.value).length === 0) return null;

  const slots = Object.entries(availabilityBySlot.value);
  const maxCount = Math.max(...slots.map(([_, count]) => count));
  const mostAvailableSlots = slots.filter(([_, count]) => count === maxCount);

  return maxCount > 0 ? { date: mostAvailableSlots[0][0], count: maxCount } : null;
});

watch(
  () => event.value?.users,
  (newUsers) => {
    if (!event.value) return

    const updatedEvent = {
      ...event.value,
      users: newUsers.map(user => ({
        name: user.name,
        selectedSlots: user.selectedSlots.map(slot => ({
          date: slot.date,
          checked: slot.checked
        }))
      }))
    }
    localStorage.setItem(`event-${slug}`, JSON.stringify(updatedEvent))
  },
  { deep: true }
)

function addUser() {
  if (!event.value) return

  event.value.users.push({
    name: '',
    selectedSlots: event.value.slots.map(slot => ({
      date: slot.date,
      checked: false
    }))
  })
}

function removeUser(index) {
  if (!event.value) return

  event.value.users.splice(index, 1)
}

function formatDate(dateStr, formatStr) {
  return format(parseISO(dateStr), formatStr, { locale: fr })
}

function formatDay(dateStr) {
  const day = format(parseISO(dateStr), 'eee', { locale: fr })
  return day.toUpperCase()
}
</script>