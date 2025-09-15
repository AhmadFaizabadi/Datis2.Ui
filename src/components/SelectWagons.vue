<template>
  <q-card bordered class="my-card bg-blue-1">
    <q-card-section>
      <div class="text-h6">انتخاب واگن</div>
      <div class="text-subtitle2">با استفاده از ابزار فیلتر واگنهای مورد نظرتان را انتخاب کنید</div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="row no-wrap" style="max-width: 100%;">
        <div class="col-4">
          <query-input v-model="model" />
        </div>
        <div class="col-8">
          <div class="column items-start justify-between no-wrap" style="height: 200px;">
            <div class="col-11 q-pa-sm latin scroll">
              {{ model?.result.join(', ') }}
            </div>
            <div class="col text-overline">واگنهای انتخاب شده = {{ model?.result.length }}</div>
          </div>
        </div>
      </div>

    </q-card-section>
    <q-separator />

    <q-card-actions>
      <q-btn flat v-close-popup>تأیید</q-btn>
      <q-btn flat v-close-popup @click="model = firstModel">انصراف</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import QueryInput from './QueryInput.vue';

const model = defineModel({
  default: {
    parameters: ["مبدأ", "مقصد", "جاری", "محموله", "مشتری", "شماره واگن", "شماره کانتینر"]
      .map(m => ({ label: m, qry: null }))
    , result: []
  }
});
const firstModel = ref(model.value);
</script>

<style scoped lang="sass">
.my-card
  width: 400px
  height: 72vh
</style>
