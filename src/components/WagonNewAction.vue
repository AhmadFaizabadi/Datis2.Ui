<template>
  <div class="q-pa-md bg-blue-1" style="max-width: 400px">

    <q-form @submit="onSubmit" class="q-gutter-md">
      <PeekDateTime v-model="adate" :label="`تاریخ ${actionName}`" time-include />
      <q-dialog v-model="selectWagonPopup">
        <select-wagons v-model="selectedWagons" />
      </q-dialog>
      <q-btn label="انتخاب واگن" @click="selectWagonPopup = true">
        <q-badge color="amber" floating>{{ selectedWagons?.result?.length }}</q-badge>
      </q-btn>
      <q-input v-model="note" label="توضیحات" stack-label filled type="textarea" />
      <div>
        <q-btn label="تأیید" type="submit" color="primary" v-close-popup @click="onSubmit" />
        <q-btn label="انصراف" color="primary" flat class="q-ml-sm" v-close-popup />
      </div>
    </q-form>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import PeekDateTime from 'components/PeekDateTime.vue';
import SelectWagons from './SelectWagons.vue';

const props = defineProps({ actionName: String });
const selectedWagons = ref();
const selectWagonPopup = ref(false);
const adate = ref();
const note = ref();

const onSubmit = () => { console.log('is going to submit...'); };
</script>
