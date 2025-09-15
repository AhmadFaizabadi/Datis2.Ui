<template>
  <q-card class="my-card column no-wrap rounded-borders items-center justify-center">
    <div class="col-auto full-width">
      <div class="q-pa-sm bg-blue-grey-11 text-grey-10 text-subtitle2 text-center text-bold">
        {{ title }}

      </div>
      <div class="row">
        <div class="col-10">
          <q-input class="self-start q-px-md" dense :autofocus="!$q.platform.is.mobile" standout outlined debounce="300"
            placeholder="جستجو" v-model.trim="searchtext">
            <template v-slot:append>
              <q-icon color="red" v-if="searchtext === ''" name="search" />
              <q-icon color="lime" v-else name="clear" class="cursor-pointer" @click="searchtext = ''" />
            </template>
          </q-input>
        </div>
        <div class="col-2">
          <span style="font-size: smaller">
            تعداد موارد
            <q-badge> {{ filtered?.length }} </q-badge>
          </span>
        </div>
      </div>
    </div>
    <div class="col-10">
      <q-virtual-scroll id="theList" class="col" component="q-list" style="width: 100%; height: 100%;" separator
        :virtual-scroll-item-size="117" :items="filtered">
        <template v-slot="{ item }">
          <q-item clickable @click="showLading(item)">
            <q-item-section>
              <div class="row">
                <wagon-plate :lading="item" />
              </div>
              <q-item-label style="width: 200px">{{ item.SourceStationName }} به
                {{ item.TargetStationName }}</q-item-label>
              <q-item-label caption lines="7" style="width: 200px; font-size: smaller">
                <ul>
                  <li>
                    <b>محموله </b>{{ item.ContainerStuffName }}
                  </li>
                  <li>
                    <b>ایستگاه جاری </b>{{ item.TrackStationName }}({{ friendlyPersianDate(item.TrackDate) }})
                  </li>
                  <li>
                    <b>وضعیت </b><q-avatar v-if="item.TrackStationName == item.AccidentStationName"
                      src="stopped.png" />{{
                        item.StateName }}
                  </li>
                  <li><b>توضیحات بارنامه </b>{{ item.Note }}</li>
                  <li v-if="item.UserMessage"><b>توضیحات کاربر </b>{{ item.UserMessage }}</li>
                </ul>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label class="text-center text-bold text-h6">{{ item.ContainerNumber }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>

    </div>
    <q-btn class="col full-width bg-blue-grey-11" flat icon="arrow_back" v-close-popup="2" />
  </q-card>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { friendlyPersianDate } from "src/myUtils";
import WagonPlate from './WagonPlate.vue';
const props = defineProps({
  title: String,
  items: Array
});
const searchtext = ref("");
const bus = inject("bus");
const showLading = (lading) => bus.emit("showLading", lading);
const filtered = computed(() => searchtext.value.length > 0 ?
  props.items.filter(f => f.LadingId == searchtext.value || f.WagonNo.toString().includes(searchtext.value)
    || f.ContainerNumber.includes(searchtext.value)) : props.items);
</script>
<style scoped>
.my-card {
  width: 23rem;
}
</style>
