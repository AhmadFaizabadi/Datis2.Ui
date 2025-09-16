<template>
  <q-list style="max-height: 50vh;" padding class="rounded-borders scroll">
    <template v-for="o, index in Object.entries(flds)" :key="index">
      <q-item>
        <q-item-section>
          <q-item-label>{{ o[1] }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ formatFieldValue(o[0], o[1]) }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced inset />
    </template>
  </q-list>
  <!-- <div class="column" style="max-height:50vh">
    <div class="col" v-for="o, index in Object.entries(flds)" :key="index">
      <div class="row">

        <div class="text-bold q-pa-sm">
          {{ o[1] }}

        </div>
        <div class="q-pa-sm">{{ formatFieldValue(o[0]) }}</div>
      </div>
    </div>
  </div> -->
</template>

<script setup>
import { persianDateTime } from "src/services/farsiDate";
const formatFieldValue = (n) => n.includes('Date') ? persianDateTime(new Date(props.lading[n])) : props.lading[n];

const flds = {
  'NextRepairDate': 'تاریخ تعمیر بعدی',
  'EnterDate': 'تاریخ ورود',
  'ExitDate': 'تاریخ شروع سیر',
  'LoadedDate': 'تاریخ بارگیری',
  'UnloadedDate': 'تاریخ تخلیه',
  'AccidentDate': 'تاریخ سانحه',
  'ArrivedDate': 'تاریخ رسیدن به مقصد',
  'AccidentStationName': 'ایستگاه سانحه',
  'UserMessage': 'توضیحات کاربر',
  'TrackStationName': 'موقعیت جاری',
  'StateName': 'وضعیت',
};
const props = defineProps({
  lading: Object
});
</script>
