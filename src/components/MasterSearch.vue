<template>
  <q-btn dens flat round icon="search" @click="showMasterSearch" />
</template>

<script setup>
import { inject } from 'vue';
const props = defineProps({ data: Array });
const bus = inject("bus");
const showMasterSearch = () => bus.emit("showWagons", props.data, "لیست همه واگنهای فعال");
</script>
