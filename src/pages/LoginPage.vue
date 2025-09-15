<template>
  <q-page class="flex flex-center bg-grey-2" style="min-height: 100vh" dir="rtl">
    <div class="q-pa-md" style="width: 100%; max-width: 420px">
      <q-card flat bordered class="q-pa-lg">
        <div class="column items-center q-mb-md">
          <q-avatar size="64px" class="bg-primary text-white">
            <q-icon :name="laKeySolid" size="32px" />
          </q-avatar>
          <div class="text-h6 q-mt-sm">ورود به سیستم</div>
          <div class="text-caption text-grey-7">لطفاً اطلاعات خود را وارد کنید</div>
        </div>

        <q-banner v-if="errorMessage" class="q-mb-md bg-red-1 text-red-10" rounded>
          <template #avatar>
            <q-icon :name="laExclamationSolid" />
          </template>
          {{ errorMessage }}
        </q-banner>

        <q-form ref="formRef" @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input v-model="email" type="text" label="نام کاربری" :rules="emailRules" clearable dense outlined
            :disable="loading" autocomplete="email" dir="ltr" input-class="text-left" lazy-rules>
            <template #prepend>
              <q-icon :name="laUserTieSolid" />
            </template>
          </q-input>

          <q-input v-model="password" :type="showPassword ? 'text' : 'password'" label="رمز عبور" :rules="passwordRules"
            dense outlined :disable="loading" autocomplete="current-password" dir="rtl" input-class="text-right"
            lazy-rules>
            <template #prepend>
              <q-icon :name="laLockSolid" />
            </template>
            <template #append>
              <q-btn flat round dense :icon="showPassword ? laEyeSlashSolid : laEyeSolid"
                @click="showPassword = !showPassword" :aria-label="showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'" />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox v-model="remember" label="مرا به خاطر بسپار" :disable="loading" />
            <q-btn flat size="sm" color="primary" class="q-ml-sm" @click="onForgotPassword">فراموشی رمز عبور؟</q-btn>
          </div>

          <q-btn type="submit" color="primary" class="full-width q-mt-sm" :label="loading ? 'در حال ورود…' : 'ورود'"
            :loading="loading" />

          <!-- <q-separator spaced />
          <q-btn outline color="teal" :icon="laTelegram" class="full-width q-mt-sm" label="ورود با تلگرام"
            @click="loginWithTelegram(true)" /> -->

          <!-- <q-separator spaced />
          <div class="row items-center justify-center text-caption text-grey-7">
            حساب کاربری ندارید؟
            <q-btn flat dense color="primary" class="q-ml-xs" to="/auth/register">ایجاد حساب</q-btn>
          </div> -->
        </q-form>
      </q-card>

      <div class="column items-center q-mt-md text-grey-6">
        <div class="text-caption">با ورود، شما با قوانین و حریم خصوصی موافقت می‌کنید.</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { laKeySolid, laEyeSolid, laEyeSlashSolid, laTelegram, laLockSolid, laUserTieSolid, laExclamationSolid } from '@quasar/extras/line-awesome';
import { useAuthStore } from 'stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { extractAxiosErrorMessage } from 'src/myUtils';

const store = useAuthStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const formRef = ref(null);
const email = ref('');
const password = ref('');
const remember = ref(true);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const emailRules = [
  (v) => !!v || 'وارد کردن ایمیل الزامی است',
  (v) => /.+@.+\..+/.test(v) || 'ایمیل نامعتبر است'
];

const passwordRules = [
  (v) => !!v || 'رمز عبور الزامی است',
  (v) => (v && v.length >= 6) || 'رمز عبور باید حداقل ۶ کاراکتر باشد'
];


async function onSubmit() {
  errorMessage.value = '';
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // نمونه واقعی با axios:
    // const res = await axios.post('/api/auth/login', { username: username.value, password: password.value, remember: remember.value })
    // const { token, user } = res.data

    await store.login(email.value, password.value, remember.value);
    $q.notify({ type: 'positive', message: `خوش آمدید ${store.user.Name ?? ''}` });
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (err) {
    // console.log('login error', err);
    // تحلیل خطا و نمایش پیام مناسب
    const code = err.status || err?.code || err?.response?.status || 'UNKNOWN';
    errorMessage.value = err?.response?.data.ErrorReason;
    // switch (code) {
    //   case 400:
    //     errorMessage.value = 'درخواست نامعتبر است. لطفاً ورودی‌ها را بررسی کنید.';
    //     break;
    //   case 401:
    //   case 'INVALID_CREDENTIALS':
    //     errorMessage.value = 'نام کاربری یا رمز عبور اشتباه است.';
    //     break;
    //   case 403:
    //   case 'LOCKED':
    //     errorMessage.value = 'دسترسی شما به دلیل محدودیت یا مسدود شدن حساب ممکن نیست.';
    //     break;
    //   case 429:
    //     errorMessage.value = 'تلاش‌های زیادی انجام داده‌اید. لطفاً چند دقیقه بعد دوباره امتحان کنید.';
    //     break;
    //   case 500:
    //     errorMessage.value = 'خطای داخلی سرور. لطفاً بعداً دوباره تلاش کنید.';
    //     break;
    //   default:
    //     errorMessage.value = err?.message || 'خطایی رخ داد. اتصال اینترنت خود را بررسی کنید.';
    //     break;
    // }

    $q.notify({ type: 'negative', message: errorMessage.value || err });
  } finally {
    loading.value = false;
  }
}

async function loginWithTelegram(showError) {
  loading.value = true;
  try {
    await store.loginWithTelegram();
    $q.notify({ type: 'positive', message: `خوش آمدید ${store.user.firstName ?? ''}` });
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (err) {
    if (showError === true)
      errorMessage.value = extractAxiosErrorMessage(err);
  }
  loading.value = false;
}
function onReset() {
  username.value = '';
  password.value = '';
  remember.value = true;
  errorMessage.value = '';
}

function onForgotPassword() {
  $q.dialog({
    title: 'بازیابی رمز عبور',
    message: 'برای بازیابی رمز عبور، ایمیل خود را وارد کنید:',
    prompt: {
      model: '',
      type: 'text',
      isValid: val => /.+@.+\..+/.test(val),
      label: 'ایمیل'
    },
    cancel: true,
    ok: {
      label: 'ارسال لینک بازیابی',
      color: 'primary'
    }
  }).onOk(email => {
    // اینجا درخواست واقعی ارسال کنید
    $q.notify({ type: 'info', message: `لینک بازیابی به ${email} ارسال شد (نمونه).` });
  });
}

onMounted(async () => {
  try {
    if (route.query.redirect && route.query.redirect.toString() !== '/')
      await loginWithTelegram(false);
  } catch {

  }
});
</script>

<style scoped>
.q-card {
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}
</style>
