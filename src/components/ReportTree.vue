<template>
  <div>
    <!-- <q-tree no-transition class="text-subtitle1" :nodes="dataTree" node-key="id" label-key="label" :filter="filter"
      :filter-method="filterLeaves" accordion @update:selected="onSelect" v-model:selected="selectedKey" ref="myTree" /> -->
    <q-markup-table style="max-height:40vh">
      <thead>
        <tr>
          <th class="text-left"><b>
              <q-select label-color="white" color="red" dense v-model="groupSet" :options="$config.masterGroups"
                label="گروه بندی بر اساس" />
            </b></th>
          <th><b>تعداد واگن ({{ ExtractCountFromLabel(dataTree[0]?.label) }})</b></th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="g in dataTree[0].children" :key="g.id" class="cursor-pointer" @click="onSelect(g)">
          <td>{{ ExtractValueFromLabel(g.label) }}</td>
          <td>{{ ExtractCountFromLabel(g.label) }}</td>
        </tr>
      </tbody>
    </q-markup-table>

  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { groupByKeys } from "src/services/dataUtils";
import { ExtractValueFromLabel, ExtractCountFromLabel } from "src/services/dataUtils";
import { useWagonStore } from "src/stores/wagon-store";

const store = useWagonStore();
const config = inject('config');
const groupSet = ref(config.masterGroups.find(f => f.label == 'مقصد'));
const selectedModel = defineModel('selected');
const dataTree = computed(() => [groupByKeys(store.data,
  groupSet.value.value.map(m => m.value), groupSet.value.value.map(m => m.label)
  , { id: config.companyName, label: config.companyName })]);
const onSelect = (target) => {
  selectedModel.value = { ...target, parents: [], level: 1, groups: groupSet.value.value };
  // console.log('selectedModel is', selectedModel.value);
};
</script>
