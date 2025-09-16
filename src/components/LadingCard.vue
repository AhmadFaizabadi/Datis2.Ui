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
          <q-tab-panel name="lading" class="column items-center">
            <LadingCardPanelLading :lading="lading" class="full-width" />
          </q-tab-panel>

          <q-tab-panel name="extra" class="column items-center">
            <LadingCardPanelExtra :lading="lading" class="full-width" />
          </q-tab-panel>

          <q-tab-panel name="track" class="column items-center">
            <LadingCardPanelTrack :lading="lading" class="full-width" />
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
