<template>
  <q-list style="max-height: 50vh;max-width:20rem" padding class="rounded-borders scroll">
    <template v-for="t, index in tracks" :key="index">
      <q-item>
        <q-item-section>
          <q-item-label>{{ t.StationName }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ friendlyPersianDate(t.TrackDate) }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced inset />
    </template>
  </q-list>
</template>

<script setup>
import { inject, onMounted, ref, computed } from "vue";
import { showError } from "src/services/commonUtils";
import { friendlyPersianDate } from "src/services/farsiDate";
const props = defineProps({
  lading: Object,
});
const tracks = ref([]);
const api = inject("api");
const trackDate = computed(() =>
  (stname) => tracks.value.find(f => stname.includes(f.StationName))?.TrackDate);
onMounted(async () => {
  try {
    const res = await api.get(`wagon/track/${props.lading.LadingId}`);
    if (res.status === 200)
      tracks.value = res.data;
    else
      showError(res.response.statusText);

  } catch (error) {
    showError(error);
  }
});
</script>
