<template>
  <q-page>
    <!-- <q-btn icon="download" @click="store.fetchData">fetch data</q-btn> -->
    <div class="row">
      <report-tree class="q-ma-xl" no-transition v-model:selected="selected" />
      <grouped-cards v-if="selected" :data="selected.children" :title="selected.label"
        :group-key="selected.groups[2].label" ref="groupedCardsRef" />
      <!-- <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px"> -->
      <div class="float-right q-pa-xl">

        <q-btn v-scroll-fire="bounceImage" round icon="arrow_circle_up" @click="scrollToElement(reportTreeRef.$el)" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import ReportTree from "src/components/ReportTree.vue";
import GroupedCards from "src/components/GroupedCards.vue";
import { scroll } from 'quasar';

const { getScrollTarget, setVerticalScrollPosition } = scroll;
function scrollToElement(el) {
  const target = getScrollTarget(el);
  const offset = el.offsetTop;
  const duration = 1000;
  setVerticalScrollPosition(target, offset, duration);
}
const selected = ref("");
const reportTreeRef = ref(null);
const groupedCardsRef = ref(null);
function bounceImage(el) {
  // in this example, when the `<div>` comes into view,
  // we bounce it for 2 seconds

  el.classList.add('animate-bounce');

  setTimeout(() => {
    // we make sure the node is still in DOM
    // (user hasn't navigated away from the Vue component
    // rendering our `<div>`)
    // so we don't generate an error
    if (document.body.contains(el)) {
      // then remove the helper class to
      // stop bouncing
      el.classList.remove('animate-bounce');
    }
  }, 2000);
}
// watch(selected, () => nextTick(() =>
//   scrollToElement(groupedCardsRef.value.$el)
// ));
</script>
<style lang="sass" scoped>
.animate-bounce
  animation: q-bounce 2s infinite

@keyframes q-bounce
  0%, 20%, 50%, 80%, 100%
    transform: translateY(0)
  40%
    transform: translateY(-30px)
  60%
    transform: translateY(-15px)
</style>
