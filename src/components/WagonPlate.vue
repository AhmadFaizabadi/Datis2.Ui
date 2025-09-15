<template>
  <div class="my-wagon cursor-pointer text-grey-10">
    <span class="q-px-xs text-overline">
      {{ String(lading.WagonNo).substr(0, 3) }}</span><span style="font-size: larger">{{
        String(lading.WagonNo).substr(3, 3)
      }}</span>
    <img class="rounded-borders absolute-center transparent" style="opacity: 0.3;height: 70%"
      :src="`${lading.ContainerStuffName}.png`" />
  </div>
</template>

<script setup>
defineProps({ lading: Object });
</script>
<style lang="sass" scoped>
.my-wagon
  height: 30px
.my-wagon:hover
  border-radius: 5px
  border: 1px solid $light-blue-12
</style>
