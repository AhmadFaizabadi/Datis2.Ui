import { Notify, date } from "quasar";

export const isValidIranianNationalId = (input) => {
  if (typeof input !== "string") return false;

  // مبدل ارقام فارسی/عربی به لاتین
  const faToEn = (s) =>
    s
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - "٠".charCodeAt(0)));

  const code = faToEn(input).replace(/\s|-/g, ""); // حذف فاصله و خط تیره

  if (!/^\d{10}$/.test(code)) return false; // دقیقاً ۱۰ رقم
  if (/^(\d)\1{9}$/.test(code)) return false; // همه ارقام یکسان نباشند

  const digits = code.split("").map(Number);
  const check = digits[9];

  // محاسبه وزن‌دار: d0*10 + d1*9 + ... + d8*2
  const sum = digits.slice(0, 9).reduce((acc, d, i) => acc + d * (10 - i), 0);

  const mod = sum % 11;
  const expected = mod < 2 ? mod : 11 - mod;

  return check === expected;
};

export const isValidIranianMobile = (input) => {
  if (typeof input !== "string") return false;

  // مبدل ارقام فارسی/عربی به لاتین
  const faToEn = (s) =>
    s
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - "٠".charCodeAt(0)));

  const mobile = faToEn(input).replace(/\s|-/g, ""); // حذف فاصله و خط تیره

  // فرمت رسمی: 09xxxxxxxxx
  return /^09\d{9}$/.test(mobile);
};

export const numberToPersianWords = (num) => {
  const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const tens = [
    "",
    "ده",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];
  const teens = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];
  const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  if (typeof num !== "number" || isNaN(num)) return "عدد نامعتبر است";
  if (num === 0) return "صفر";

  const splitNumber = (n) => {
    const parts = [];
    while (n > 0) {
      parts.push(n % 1000);
      n = Math.floor(n / 1000);
    }
    return parts;
  };

  const threeDigitToWords = (n) => {
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;
    let words = [];

    if (h) words.push(hundreds[h]);
    if (t > 1) {
      words.push(tens[t]);
      if (o) words.push(ones[o]);
    } else if (t === 1) {
      words.push(teens[o]);
    } else if (o) {
      words.push(ones[o]);
    }

    return words.join(" و ");
  };

  const parts = splitNumber(num);
  const wordParts = parts
    .map((part, i) => {
      if (part === 0) return null;
      const words = threeDigitToWords(part);
      return scales[i] ? `${words} ${scales[i]}` : words;
    })
    .filter(Boolean)
    .reverse();

  return wordParts.join(" و ");
};

const myDictionary = {
  "price quote has expired.": "تاریخ قیمت منقضی شده است.",
  "order created successfully.": "سفارش شما با موفقیت ثبت شد.",
  "an order with the same price quote and type already exists for this user.":
    "شما قبلاً این سفارش را ثبت کرده‌اید!",
};
export const extractAxiosErrorMessage = (err, transalte) => {
  const msg = err.response?.data?.message || err.response?.data || err.message;
  return transalte ? translateIt(msg) : msg;
};
export const translateIt = (msg) => myDictionary[msg.toLowerCase()] || msg;
export const notifyAxiosError = (err) => {
  Notify.create({
    type: "negative",
    message: extractAxiosErrorMessage(err, true),
  });
};
export const persianDate = (date) =>
  date &&
  IntlDateFarsi.format(typeof date === "string" ? new Date(date) : date);
export const persianDateTime = (date) =>
  date &&
  IntlDateTimeFarsi.format(typeof date === "string" ? new Date(date) : date);
export const IntlDateFarsi = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
  timezone: "Asia/Tehran",
});
export const IntlDateTimeFarsi = new Intl.DateTimeFormat(
  "fa-IR-u-nu-latn-hc-h24",
  {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timezone: "Asia/Tehran",
  }
);

export function friendlyPersianDate(inputDate) {
  if (!inputDate) return "";
  //1388/10/22
  // var persianYear = persianDate.substr(0,4);
  // var persianMonth = persianDate.Month.substr(5,2);
  // var persianDay = persianDate.Day.substr(8,2);

  // //13:14
  // var hour = persianDate.substr(11,2);
  // var min = persianDate.substr(14,2);
  // var hhMm =`${hour}:${min}`;
  const gDate = typeof inputDate !== "string" ? inputDate : new Date(inputDate);
  const persianDate = persianDateTime(gDate);
  const now = new Date();
  // window.jalaali = jalaali;
  let totalSeconds = date.getDateDiff(gDate, now, "seconds");
  let totalDays = Math.floor(date.getDateDiff(gDate, now, "days"));
  let suffix = " بعد";
  if (totalSeconds < 0) {
    suffix = " قبل";
    totalSeconds = Math.abs(totalSeconds);
    totalDays = Math.abs(totalDays);
  }

  let dateTimeToday = now;
  let yesterday = date.subtractFromDate(dateTimeToday, { days: 1 });
  let tomorrow = date.addToDate(dateTimeToday, { days: 1 });

  let hhMm = `، ساعت ${persianDate.substr(-5, 5)}`;
  if (date.isSameDate(dateTimeToday, gDate, "day")) {
    // Less than one minute ago.
    if (totalSeconds < 60) {
      return "هم اکنون";
    }
    // Less than 2 minutes ago.
    if (totalSeconds < 120) {
      return `یک دقیقه${suffix}${hhMm}`;
    }

    // Less than one hour ago.
    if (totalSeconds < 3600) {
      return `${Math.floor(totalSeconds / 60)} دقیقه ${suffix}${hhMm}`;
    }

    // Less than 2 hours ago.
    if (totalSeconds < 7200) {
      return `یک ساعت${suffix}${hhMm}`;
    }

    // Less than one day ago.
    if (totalSeconds < 86400) {
      return `${Math.floor(totalSeconds / 3600)} ساعت${suffix}${hhMm}`;
    }
  }

  if (date.isSameDate(yesterday, gDate, "day")) {
    return `دیروز ${date.formatDate(gDate, "dddd")}${hhMm}`;
  }

  if (date.isSameDate(tomorrow, gDate, "day")) {
    return `فردا ${date.formatDate(gDate, "dddd")}${hhMm}`;
  }
  let dayStr = " " + persianDate.substr(0, 10);
  if (totalSeconds < 30 * 3600 * 24) {
    return `${Math.abs(totalDays)} روز${suffix}${dayStr}`;
  }

  if (totalSeconds < 12 * 3600 * 24 * 30) {
    let months = Math.floor(Math.abs(totalDays) / 30);
    return months <= 1
      ? `1 ماه${suffix}${dayStr}`
      : `${months} ماه${suffix}${dayStr}`;
  }

  let years = Math.floor(Math.abs(totalDays) / 365);
  let daysMonths = Math.abs(totalDays) / 30;
  let nextMonths = Math.trunc(daysMonths) - years * 12 - 1;
  let and = years >= 1 ? " و " : "";
  let nextMonthsStr = nextMonths <= 0 ? "" : `${and}${nextMonths} ماه`;

  if (years < 1) {
    return `${nextMonthsStr}${suffix}${dayStr}`;
  }

  return `${years} سال${nextMonthsStr}${suffix}${dayStr}`;
}
export const happyColors = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];
