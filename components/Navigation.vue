<template>
  <UNavigationMenu color="primary" variant="link" :items="items" class="w-full">
    <template v-if="isClient" #components-system>
      <UButton variant="ghost"
        :color="colorMode.preference === 'system' ? 'primary' : 'neutral'" icon="i-lucide-monitor"
        @click="setTheme('system')" />
    </template>
    <template v-if="isClient" #components-light>
      <UButton variant="ghost"
        :color="colorMode.preference === 'light' ? 'primary' : 'neutral'" icon="i-lucide-sun"
        @click="setTheme('light')" />
    </template>
    <template v-if="isClient" #components-dark>
      <UButton variant="ghost"
        :color="colorMode.preference === 'dark' ? 'primary' : 'neutral'" icon="i-lucide-moon"
        @click="setTheme('dark')" />
    </template>
  </UNavigationMenu>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const colorMode = useColorMode()


const isClient = ref(false)

onMounted(() => {
  isClient.value = true

  if (!colorMode.preference) {
    colorMode.preference = 'light'
  }
})

const setTheme = (mode) => {
  console.log('Theme set to:', mode)
  colorMode.preference = mode
}

const items = ref([
  [
    {
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/'
    },
    {
      label: 'Create',
      icon: 'i-lucide-book-open',
      to: '/create'
    },
    {
      label: 'Event',
      icon: 'i-lucide-database',
      to: '/event'
    },
  ],
  [
    {
      slot: 'components-system',
    },
    {
      slot: 'components-dark'
    },
    {
      slot: 'components-light'
    }
  ]
])
</script>
