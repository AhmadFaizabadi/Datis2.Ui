<template>
  <q-markup-table separator="vertical" dense bordered class="my-table">
    <thead>
      <tr>
        <th>
          {{ groupKey }}
        </th>
        <th style="max-width: 60px">تعداد واگن</th>
      </tr>
    </thead>
    <tbody>
      <tr class="cursor-pointer" height="24px" v-for="g in data" :key="g.id"
        @click.stop="showWagons(g.children, header + ' / ' + g.label)">
        <td>
          {{ ExtractValueFromLabel(g.label)
          }}
        </td>
        <td>
          <div v-if="!includeDetails || groupKey == 'وضعیت'" class="text-h6 q-mr-md">
            {{ ExtractCountFromLabel(g.label) }}
          </div>
          <table v-else class="inner-table fit">
            <tbody>
              <tr>
                <th rowspan="2">
                  {{ ExtractCountFromLabel(g.label) }}
                </th>
                <th v-for="sg in g.children" :key="sg.id" class="state-detail">
                  <!-- {{ $stateIcons[s.name] }} -->
                  {{ ExtractValueFromLabel(sg.label) }}
                  <!-- <q-tooltip>{{s.name}}</q-tooltip> -->
                </th>
              </tr>
              <tr>
                <td v-for="sg in g.children" :key="sg.id" @click.stop="showWagons(sg.children)">
                  {{ ExtractCountFromLabel(sg.label) }}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup>
import { ref, inject } from "vue";
import { ExtractCountFromLabel, RemoveItemsFromLabel, ExtractValueFromLabel, aggregateChildren } from 'src/services/dataUtils';
const props = defineProps({
  data: Array,
  groupKey: String,
  header: String
});
const bus = inject("bus");
const includeDetails = ref(false);
const showWagons = (wagons, title) => {
  let w = aggregateChildren(wagons);
  if (!w[0].WagonNo) w = w[0].children;
  title = RemoveItemsFromLabel(title);
  // console.log('wagons are', w);
  bus.emit("showWagons", w, title);
};
;
</script>
<style lang="sass" scoped>

.body--light
  .my-card
    background-color: $light-blue-2
    color: black
  .my-table
    max-height: 310px
  tr.my-table
    background-color: $cyan-4
    color: white
  th.my-table
    white-space: normal
    font-weight: 600
  td.my-table
    color: #210303fa
    background-color: #ebf0f1
    font-size: 13px
  table.inner-table
    border: 1px solid wheat
    border-collapse: collapse
    border-radius: 5px
    padding: 6px
    td
      cursor: pointer
      font-size: 10px
      text-align: center
      border: 1px solid grey
    th
      border: 1px solid grey
      text-align: center
      border-collapse: collapse
      padding: 6px
      font-size: 14px
      background-color: $grey-2
th.state-detail
  max-width: 20px
  max-height: 30px
  overflow: hide
  font-size: 8px!important
  white-space: normal
</style>
