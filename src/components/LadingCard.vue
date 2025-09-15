<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab name="lading" label="اطلاعات بارنامه" icon="mail" />
          <q-tab name="extra" label="اطلاعات تکمیلی" icon="post_add" />
          <q-tab name="track" label="اطلاعات سیر" icon="timeline" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="lading">
            <div class="text-h6 q-pb-lg text-red-8">اطلاعات بارنامه</div>
            <LadingCardPanelLading :lading="lading" />
          </q-tab-panel>

          <q-tab-panel name="extra">
            <div class="text-h6 q-pb-lg text-blue-8">اطلاعات تکمیلی</div>
            <LadingCardPanelExtra :lading="lading" />
          </q-tab-panel>

          <q-tab-panel name="track">
            <div class="text-h6 q-pb-lg text-amber-8">اطلاعات سیر</div>
            <LadingCardPanelTrack :lading="lading" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LadingCardPanelLading from "./LadingCardPanelLading.vue";
import LadingCardPanelExtra from "./LadingCardPanelExtra.vue";
import LadingCardPanelTrack from "./LadingCardPanelTrack.vue";
const props = defineProps({ lading: Object });
const tab = ref("lading");
</script>
