<template>
  <q-field outlined :label="label" stack-label>
    <div class="row q-gutter-sm no-wrap">

      <div class="col q-pa-md" style="max-width: 300px">
        <q-input filled v-model="date" mask="date" :rules="['date']" :hint="fullPersianDate(model)">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date" calendar="persian" today-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="انتخاب" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col q-pa-md" v-if="timeInclude" style="max-width: 200px">
        <q-input filled v-model="time" mask="time" :rules="['time']">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="time">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="انتخاب" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </q-field>
</template>

<script setup>
import { ref, watch } from 'vue';
import { persianDateTime, fullPersianDate, convertJalaliToGregorian } from 'src/services/farsiDate';
const props = defineProps({
  timeInclude: Boolean,
  label: { type: String, default: 'تاریخ' }
});
const model = defineModel({ default: new Date() });
const date = ref(persianDateTime(model?.value).substring(0, 10));
const time = props.timeInclude ? ref(persianDateTime(model?.value).substring(12, 17)) : ref();
watch([date, time], () =>
  model.value = convertJalaliToGregorian(date.value, time.value)
);
</script>
