<template>
  <div class="wbox rounded-borders no-wrap row">
    <img class="w-icon" :src="wicon" />
    <div>

      <div>{{ lading.WagonNo }}</div>
      <br>
      <div>{{ lading.ContainerNumber }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  lading: Object
});
const wicon = computed(() => {
  if (props.lading.AccidentDate && props.lading.AccidentStationName
    == props.lading.TrackStationName) return "stopped.png";
  else
    if (props.lading.NextWagonMajorRepairDate) return "emergency-repair.png";
    else
      if (props.lading.StuffName.includes('تعمیر')) return "garage.png";
      else
        if (props.lading.StuffName == 'واگن بدون بار') return "1883.png";
        else
          if (props.lading.ContainerStuffName == 'کانتینر خالی') return "empty-container.png";
  // else if (props.lading.ContainerStuffName != 'ناشناس')
  return "container.png";
});
</script>
<style scoped lang="sass">
.wbox
  width: 4rem
  height: 3rem
  border: 1px solid
  font-size: 9px
.w-icon
  height: 3rem
</style>
