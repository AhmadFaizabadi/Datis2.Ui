<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Datis Seir
        </q-toolbar-title>
        <master-search :data="store.data" />
        <div class="cursor-pointer" @click="showUpdateInfo">تاریخ بروز رسانی {{ store.reportDate }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <essential-link />
    </q-drawer>

    <q-page-container class="bkg-page">
      <router-view />
      <q-dialog v-model="listWagonsVisible" full-height>
        <list-wagons-dialog :items="visibleWagons" :title="listTitle" />
      </q-dialog>
      <q-dialog v-model="ladingVisible" full-height>
        <lading-card :lading="visibleLading" style="width: 80vw" />
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import MasterSearch from 'src/components/MasterSearch.vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useWagonStore } from 'src/stores/wagon-store';
import ListWagonsDialog from 'src/components/ListWagonsDialog.vue';
import LadingCard from "src/components/LadingCard.vue";
const store = useWagonStore();
const bus = inject("bus");
const visibleWagons = ref([]);
const visibleLading = ref({});
const ladingVisible = ref(false);
const listTitle = ref("لیست واگنها");
const listWagonsVisible = ref(false);
bus.on("showWagons", (wagons, title) => {
  visibleWagons.value = wagons;
  listTitle.value = title;
  listWagonsVisible.value = true;
});

const $q = useQuasar();
bus.on("showLading", (lading) => {
  visibleLading.value = lading;
  ladingVisible.value = true;
});
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () =>
  leftDrawerOpen.value = !leftDrawerOpen.value;
const fetchDataPriodically = (onMinutes) =>
  setInterval(async () => store.fetchData(), onMinutes * 60000);
onMounted(async () => {
  await store.fetchData();
  fetchDataPriodically(1);
});
const showUpdateInfo = () => {
  $q.dialog({
    title: 'زمان آخرین بروز رسانی‌ها',
    message: `<b>دریافت بارنامه </b>${store.ladingCheckDate}<br>
    <b>دریافت موقعیت </b>${store.trackCheckDate}<br>
    <b>تهیه گزارش </b>${store.reportDate}<br>
        `,
    html: true
  });
};
</script>

<style scoped lang="sass">
.bkg-page
	background: url("/email-pattern.png")
	background-repeat: repeat
  </style>
