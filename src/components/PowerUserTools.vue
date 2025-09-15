<template>
  <div class="column items-center" style="margin-top: 100px; margin-bottom: 100px;">

    <q-fab vertical-actions-align="left" color="secondary" :icon="`keyboard_arrow_${direction}`" :direction="direction">
      <q-fab-action color="primary" @click="reprocessLading" icon="rebase_edit" label="محاسبه مجدد" />
    </q-fab>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { showError, notify } from "src/services/commonUtils";
const props = defineProps({ lading: Object, direction: String });
const api = inject("api");
const reprocessLading = async () => {
  try {
    const res = await api.post(`wagon/singleprocess/${props.lading.LadingId}`);
    if (res.status === 200)
      notify("درخواست پردازش با موفقیت ارسال شد.");
    else
      showError(res.response.statusText);

  } catch (error) {
    showError(error);
  }
};
</script>
