<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg shadow-2 rounded-borders" style="max-width: 500px; width: 100%">
      <q-icon v-if="telegramInitData" :name="laTelegram" color="blue" size="xl" />
      <q-card-section>
        <div class="text-h5 text-center">📝 ثبت‌نام کاربر</div>
      </q-card-section>

      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-select v-model="form.gender" :options="genderOptions" label="جنسیت"
          :rules="[(val) => !!val || 'جنسیت الزامی است']" emit-value outlined prepend-icon="las la-venus-mars" />

        <q-input v-model="form.firstName" label="نام" outlined :rules="[(val) => !!val || 'نام الزامی است']"
          prepend-icon="las la-user" />
        <q-input v-model="form.lastName" label="نام خانوادگی" outlined
          :rules="[(val) => !!val || 'نام خانوادگی الزامی است']" prepend-icon="las la-user" />

        <q-uploader label="تصویر کارت ملی (حداکثر ۴ مگابایت)" accept="image/*" :auto-upload="false"
          @added="onImageSelected" max-files="1" max-file-size="4000000" outlined @rejected="onRejected" />

        <!-- <div v-if="form.idCardImage" class="q-mt-md text-center">
          <q-img :src="'data:image/png;base64,' + form.idCardImage" style="max-width: 200px; border-radius: 8px;" />
        </div> -->

        <q-input v-model="form.address" label="آدرس" type="textarea" outlined
          :rules="[(val) => !val || val.length > 4 || 'آدرس وارد نشده است']" prepend-icon="las la-address-card" />
        <q-input v-model="form.mobileNumber" label="شماره موبایل" type="tel" outlined
          :rules="[(val) => !val || isValidIranianMobile(val) || 'شماره موبایل صحیح نیست']"
          prepend-icon="las la-phone" />

        <q-input v-model="form.codeMeli" label="کد ملی" outlined :rules="[
          (val) => !!val || 'کد ملی الزامی است',
          (val) => isValidIranianNationalId(val) || 'کد ملی معتبر نیست',
        ]" prepend-icon="las la-id-card" />

        <q-input v-model="form.email" label="ایمیل" type="email" outlined prepend-icon="las la-envelope" />
        <q-input v-if="!telegramInitData" v-model="form.password" label="رمز عبور" type="password"
          :rules="[val => !!val || 'رمز عبور الزامی است', val => val?.length > 5 || 'رمز عبور حداقل ۶ حرفی باشد']" />
        <div class="q-mt-md">
          <q-btn label="ثبت‌نام" type="submit" color="primary" class="full-width" :loading="loading" unelevated rounded
            icon="las la-user-plus" />
        </div>

        <div class="q-mt-md text-center">
          <q-btn outline color="secondary" class="full-width" label="انصراف" to="/" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "stores/auth";
import { isValidIranianNationalId, isValidIranianMobile } from "src/myUtils";
import "@quasar/extras/line-awesome/line-awesome.css";
import { laTelegram } from "@quasar/extras/line-awesome";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const loading = ref(false);
const authStore = useAuthStore();

const form = ref({
  firstName: "",
  lastName: "",
  gender: "",
  address: "",
  mobileNumber: "",
  codeMeli: "",
  email: "",
  idCardImage: null,
  password: null
});

const genderOptions = [
  { label: "مرد", value: "مرد" },
  { label: "زن", value: "زن" },
];

function onImageSelected(files) {
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.idCardImage = e.target.result.split(",")[1];
    };
    reader.readAsDataURL(file);
  }
}

function onRejected() {
  $q.notify({ type: "negative", message: "تصویر انتخاب شده مناسب نیست. تصویر کوچکتری انتخاب کنید." });
}

async function onSubmit() {
  loading.value = true;
  try {

    await authStore.register(form.value);

    $q.notify({
      type: "positive", position: "top-left",
      message: "ثبت‌نام با موفقیت انجام شد.\nتأیید مدارک و فعال شدن حساب کاربری شما از طریق تلگرام به اطلاع شما خواهد رسید.", timeout: 30000
    });
    router.push({ path: '/', replace: true });
  } catch (err) {
    $q.notify({
      type: "negative",
      message:
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        err ||
        "خطا در ثبت‌نام",
    });
  } finally {
    loading.value = false;
  }
}

</script>
