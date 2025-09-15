<template>
  <q-list dense bordered separator style="font-size: xx-small;max-height: 235px;" class="bg-light-blue-2 scroll">
    <q-item class="bg-light-blue-5 text-white text-center" v-touch-hold.mouse="clearFilter">
      <q-item-section class="text-weight-bold">
        <q-item-label>فیلتر ({{ query.result?.length }})</q-item-label>
      </q-item-section>
    </q-item>
    <template v-for="item, index in query?.parameters" :key="index">
      <q-item clickable v-ripple @click="onFieldSelect(item)">
        <q-item-section class="scroll">
          <q-item-label>
            {{ item.label }}
            <q-badge style="font-size: xx-small;" v-if="item.qry?.operator === 'in'" color="red">{{
              item.qry?.count }}</q-badge>
          </q-item-label>
          <q-item-label v-if="item.qry" caption lines="4">{{ item.qry.value }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useWagonStore } from "src/stores/wagon-store";
import { GroupByKey } from "src/services/dataUtils";
import { onMounted } from "vue";

const query = defineModel({
  default:
  {
    parameters: ["مبدأ", "مقصد", "جاری", "محموله", "مشتری", "شماره واگن", "شماره کانتینر"]
      .map(m => ({ label: m, qry: null })),
    result: []
  }
});
const store = useWagonStore();
const $q = useQuasar();
const onFieldSelect = (f) => {
  let actions;
  switch (f.label) {
    case "مبدأ":
    case "مقصد":
    case "جاری":
    case "محموله":
    case "مشتری":
      const fldNames = {
        "مبدأ": "SourceStationName", "مقصد": "TargetStationName", "جاری": "TrackStationName"
        , "محموله": "StuffName", "مشتری": "CustomerName"
      };
      actions = [{ label: `همه ${f.label} ها`, id: 'all' }, ...GroupByKey(store.data, fldNames[f.label]).map(m => ({ label: m, id: fldNames[f.label] }))];
      $q.bottomSheet({ message: `لطفاً ${f.label} را انتخاب کنید`, actions, grid: true }
      ).onOk(a => {
        const newModelValue = { ...query.value };
        newModelValue.parameters.find(w => w.label === f.label).qry =
          a.id === 'all' ? null : { fld: a.id, operator: '===', value: `"${a.label}"` };
        newModelValue.parameters.sort((a, b) => a.qry ? -1 : 1 - b.qry ? -1 : 1);
        newModelValue.result = getResult();
        query.value = newModelValue;
        // console.log('query model is now', query.value);
      }
      );
      break;

    case "شماره واگن":
      inputWagonNumbers();
      break;
    case "شماره کانتینر":
      inputContainerNumbers();
      break;
  }
};
const getResult = () => {
  const qry = query.value.parameters.filter(f => f.qry)
    .map(m => m.qry.operator === 'in' ? `([${m.qry.value}].includes(f.${m.qry.fld}))`
      : `(f.${m.qry.fld} ${m.qry.operator} ${m.qry.value})`)
    .join(" && ");
  const filtered = store.data.filter(f => eval(qry));
  return filtered.map(m => m.WagonNo);
};
const inputWagonNumbers = () => {
  $q.dialog({
    title: 'انتخاب شماره واگن',
    message: 'شماره واگن? (مانند 14700 یا 14799-14700 یا 14700,14714,14715)',
    prompt: {
      model: '',
      // isValid: val => val && val.length > 2, // << here is the magic
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    let involved;
    if (data.indexOf('-') !== -1) {
      const [wmin, wmax] = data.split('-').map(m => (m + '0000000').substring(0, 6));
      involved = store.data.filter(w => String(w.WagonNo).substring(0, 6) >= wmin
        && String(w.WagonNo).substring(0, 6) <= wmax)
        .map(m => m.WagonNo);
    } else {
      const wns = data.split(',').map(m => (m + '0000000').substring(0, 6));
      involved = store.data.filter(w => wns.includes(String(w.WagonNo).substring(0, 6)))
        .map(m => m.WagonNo);
    }
    const newModelValue = { ...query.value };
    const parameter = newModelValue.parameters.find(w => w.label === 'شماره واگن');
    parameter.qry = !data ? null : { fld: 'WagonNo', operator: 'in', value: involved.join(','), count: involved.length };
    newModelValue.result = getResult();
    query.value = newModelValue;
  });
};
const inputContainerNumbers = () => {
  $q.dialog({
    title: 'انتخاب شماره کانتینر',
    message: 'شماره کانتینر? (مانند 4497821 یا 4497899-4497800 یا 4497821,4497822,4497823)',
    prompt: {
      model: '',
      // isValid: val => val && val.length > 2, // << here is the magic
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    let involved;
    if (data.indexOf('-') !== -1) {
      const [wmin, wmax] = data.split('-').map(m => (m + '0000000').substring(0, 6));
      involved = store.data.filter(w => String(w.ContainerNumber).substring(0, 6) >= wmin
        && String(w.ContainerNumber).substring(0, 6) <= wmax)
        .map(m => `"${m.ContainerNumber}"`);
    } else {
      const wns = data.split(',').map(m => (m + '0000000').substring(0, 6));
      involved = store.data.filter(w => wns.includes(String(w.ContainerNumber).substring(0, 6)))
        .map(m => `"${m.ContainerNumber}"`);
    }
    const newModelValue = { ...query.value };
    const parameter = newModelValue.parameters.find(w => w.label === 'شماره کانتینر');
    parameter.qry = !data ? null : { fld: 'ContainerNumber', operator: 'in', value: involved.join(','), count: involved.length };
    newModelValue.result = getResult();
    query.value = newModelValue;
  });
};
const clearFilter = () => query.value = {
  parameters: ["مبدأ", "مقصد", "جاری", "محموله", "مشتری", "شماره واگن", "شماره کانتینر"]
    .map(m => ({ label: m, qry: null })),
  result: []
};
onMounted(() => query.value = { parameters: query.value.parameters, result: getResult() });
</script>
