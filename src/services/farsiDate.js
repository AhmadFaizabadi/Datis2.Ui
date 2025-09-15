import { date } from "quasar";
import { toGregorian } from "jalaali-js";

export const FormatDateTime = (datetime) => {
  return date.formatDate(datetime, "YYYY-MM-DD HH:mm:ss");
};

export const FormatDate = (datetime) => {
  return date.formatDate(datetime, "YYYY-MM-DD");
};

export const FormatDateTimeShort = (datetime) => {
  return date.formatDate(datetime, "YYYYMMDDHHmmss");
};
export const IntlDateFarsi = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
  timezone: "Asia/Tehran",
});
export const IntlSimpleDateFarsi = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  // timezone: "Asia/Tehran",
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

export function dateAfterDays(ddays) {
  const ddate = date.addToDate(new Date(), { days: ddays });
  return friendlyPersianDate(ddate);
}

export const persianDate = (date) => date && IntlDateFarsi.format(date);
export const fullPersianDate = (date) => {
  if (!date) return date;
  const fi = new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timezone: "Asia/Tehran",
  });
  const parts = fi.formatToParts(date);

  // استخراج بخش‌های موردنظر
  const weekday = parts.find((part) => part.type === "weekday").value;
  const day = parts.find((part) => part.type === "day").value;
  const month = parts.find((part) => part.type === "month").value;
  const year = parts.find((part) => part.type === "year").value;

  // ترکیب ترتیب دلخواه
  const formattedDate = `${weekday}، ${day} ${month} ${year}`;
  return formattedDate;
};
export const persianDateTime = (datetime) => {
  let res = "";
  try {
    if (datetime.getFullYear() > 1970) res = IntlDateTimeFarsi.format(datetime);
  } catch {}
  return res;
};

export const unixToDate = (unixTimestamp) => {
  if (unixTimestamp === 0) return null;
  const d = new Date(unixTimestamp * 1000);
  return d; //date.subtractFromDate(d, { minutes: -d.getTimezoneOffset() });
};

export function convertJalaliToGregorian(jalaliDate, time) {
  if (!jalaliDate) return jalaliDate;
  // جدا کردن بخش‌های تاریخ شمسی
  const [jYear, jMonth, jDay] = jalaliDate.split("/").map(Number);
  // تبدیل به تاریخ میلادی
  const { gy, gm, gd } = toGregorian(jYear, jMonth, jDay);

  // جدا کردن بخش‌های ساعت
  const [hours, minutes, seconds] = time
    ? (time + ":00").substring(0, 8).split(":").map(Number)
    : [0, 0, 0];

  // ساخت آبجکت Date
  return new Date(gy, gm - 1, gd, hours, minutes, seconds);
}
