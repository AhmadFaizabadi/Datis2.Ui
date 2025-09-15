<template>
  <q-list style="max-height: 50vh;max-width:20rem" bordered padding class="rounded-borders scroll"> <template
      v-for="o, index in Object.entries(flds)" :key="index">
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
        <div class="q-pa-sm">{{ formatFieldValue(o[0], o[1]) }}</div>
      </div>
    </div>
    <PowerUserTools class="absolute-bottom-left" :lading="lading" direction="up" />
  </div> -->
</template>

<script setup>
import { persianDateTime } from "src/services/farsiDate";
import PowerUserTools from "./PowerUserTools.vue";
const formatFieldValue = (n, label) => n.includes('Date') ? persianDateTime(new Date(props.lading[n])) :

  typeof props.lading[n] === 'number' && !(label.includes('شماره') || label.includes('شناسه'))
    ? props.lading[n].toLocaleString() : props.lading[n];

const flds = {
  'LadingId': 'شناسه بارنامه',
  'LadingNo': 'شماره بارنامه',
  'LadingDate': 'تاریخ بارنامه',
  'WagonNo': 'شماره واگن',
  'ContainerNumber': 'شماره کانتینر',
  'SourceStationName': 'مبدأ',
  'SourceSubStationName': 'ایستگاه فرعی',
  'TargetStationName': 'مقصد',
  'TargetSubStationName': 'ایستگاه فرعی مقصد',
  'StuffName': 'محموله',
  'CustomerName': 'نام مشتری',
  'DistanceKM': 'مسافت (کیلومتر)',
  'Weight1KG': 'وزن حقیقی (کیلوگرم)',
  'Weight2KG': 'وزن محسوب (کیلوگرم)',
  'LadingPriceTooman': 'مبلغ بارنامه (تومان)',
  'Note': 'توضیحات بارنامه',
};
const props = defineProps({
  lading: Object
});
</script>
