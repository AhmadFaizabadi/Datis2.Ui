<template>
  <q-page padding>
    <q-btn @click="loadChart">load chart!</q-btn>
    <div id="container"></div>

  </q-page>
</template>


<script setup>
import { ref, inject, onMounted } from "vue";
import { groupByKeys, flattenTree } from 'src/services/dataUtils';
const config = inject("config");
const layers = config.masterGroups.find(f => f.label == "مقصد");
const root = config.companyName;
let groupedData = groupByKeys(config.data, layers.value.map(m => m.value), layers.value.map(m => m.label), { id: root, label: root });
let flatten = flattenTree(groupedData);

console.log('grouped data is', groupedData);
console.log('flatten data is', flatten);
const loadChart = () => {
  Highcharts.chart('container', {
    chart: {
      inverted: true,
      marginBottom: 10
    },
    title: {
      text: 'Inverted treegraph',
      align: 'left'
    },
    series: [
      {
        type: 'treegraph',
        data: flatten,
        tooltip: {
          pointFormat: '{point.label}'
        },
        dataLabels: {
          pointFormat: '{point.label}',
          style: {
            whiteSpace: 'nowrap',
            color: '#000000',
            textOutline: '3px contrast'
          },
          crop: true
        },
        marker: {
          radius: 6
        },
        levels: [
          {
            level: 1,
            dataLabels: {
              align: 'left',
              x: 20
            }
          },
          {
            level: 2,
            colorByPoint: true,
            dataLabels: {
              align: 'left',
              x: 20
            }
          },
          {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5
            },
            dataLabels: {
              verticalAlign: 'top',
              rotation: 90,
              y: 20
            }
          }
        ]
      }
    ]
  });

};


</script>

<style scoped>
#container {
  width: 100%;
  min-width: 360px;
  margin: 0 auto;
}
</style>