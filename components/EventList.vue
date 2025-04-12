<template>
    <div>
        <h2>{{ event.name }}</h2>
        <p>{{ event.description }}</p>
        <div>
            <SlotButton v-for="slot in event.slots" :key="slot.id" :slot="slot" @reserve="reserveSlot" />
        </div>
    </div>
</template>

<script setup>
import SlotButton from './SlotButton.vue';

const props = defineProps({
    event: Object
});

const emit = defineEmits(['booking']);

function reserveSlot(slot) {
    emit('booking', slot);
}
</script>

<style scoped>
h2 {
    color: #333;
}
</style>