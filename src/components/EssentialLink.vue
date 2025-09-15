<template>
  <q-list style="min-width: 100px">
    <q-item clickable @click="openWagonNewAction('بارگیری واگن')">
      <q-item-section avatar>
        <q-avatar icon="add" color="green" text-color="white" />
      </q-item-section>
      <q-item-section>ثبت بارگیری واگن</q-item-section>
    </q-item>
    <q-item clickable @click="openWagonNewAction('تخلیه واگن')">
      <q-item-section avatar>
        <q-avatar icon="remove" color="orange" text-color="white" />
      </q-item-section>
      <q-item-section>ثبت تخلیه واگن</q-item-section>
    </q-item>
    <q-separator />
    <q-item clickable @click="logout">
      <q-item-section avatar>
        <q-avatar icon="logout" color="red" text-color="white" />
      </q-item-section>
      <q-item-section>خروج</q-item-section>
    </q-item>
  </q-list>
  <q-dialog v-model="wagonNewActionPopup">
    <wagon-new-action :action-name="actionName" />
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from 'stores/auth';
import WagonNewAction from './WagonNewAction.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const actionName = ref("");
const wagonNewActionPopup = ref(false);

const openWagonNewAction = (a) => {
  actionName.value = a;
  wagonNewActionPopup.value = true;
};
const store = useAuthStore();
const logout = () => {
  store.logout();
  router.go(0);
};

</script>
