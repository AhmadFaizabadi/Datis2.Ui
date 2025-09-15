<template>
  <div class="row justify-center q-gutter-lg q-pa-lg" id="theList">
    <q-card class="my-card shadow-4 text-white" v-for="g in data" :key="g.id">
      <q-card-section>
        <div>
          <ul>
            <li class="elipsis">
              {{ title }}
            </li>
            <li>{{ g.label }}</li>
            <!-- <li>
									<q-btn dense padding="xs" @click="showAll(subg.name)"
										>تعداد واگن: {{ subg.count }}</q-btn
									>
								</li> -->
          </ul>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <div class="col">

            <transition appear appear-active-class="animated backInUp slower">
              <table-list-wagons :data="g.children" :group-key="groupKey" :header="`${title} / ${g.label}`" />
            </transition>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import TableListWagons from "components/TableListWagons.vue";

const props = defineProps({
  data: Array,
  title: String,
  groupKey: String
});


</script>

<style lang="sass" scoped>
body.body--light
	.my-card
		background: linear-gradient(0deg, $teal-11 0%, $light-blue-9 100%)
		color: black
	th
		background-color: #00bcd4
		color: white
	td
		color: #210303fa
		background-color: #ebf0f1

body.body--dark
	.my-card
		background-color: $blue-grey-14
	th
		background-color: #a0adb9
	td
		background-color: #d3dce891
		color: #e4e4e4
.eta
	position: relative
	left: 3px
	padding: 1px
	font-size: 9px
.my-card
	height: max-content
.my-table
	tr
		cursor: pointer
	th
		white-space: normal
		font-size: smaller
		font-weight: 600

	td
		font-size: small
		max-height: 300px
</style>
