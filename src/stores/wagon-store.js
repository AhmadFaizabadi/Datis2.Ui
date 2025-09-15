import { defineStore } from "pinia";
import { friendlyPersianDate, unixToDate } from "src/services/farsiDate";
import { api } from "src/boot/axios";
// const unixToDate = (t) => new Date((t - 621355968000000000) / 10000);
// const unixToDate = (t) => new Date((t - 621356004000000000) / 10000);
export const useWagonStore = defineStore("wagon", {
  state: () => ({
    data: [],
    reportTimeStamp: 0,
    ladingCheckTimeStamp: 0,
    trackCheckTimeStamp: 0,
  }),
  getters: {
    reportDate: (state) =>
      friendlyPersianDate(unixToDate(state.reportTimeStamp)),
    ladingCheckDate: (state) =>
      friendlyPersianDate(unixToDate(state.ladingCheckTimeStamp)),
    trackCheckDate: (state) =>
      friendlyPersianDate(unixToDate(state.trackCheckTimeStamp)),
  },
  actions: {
    async fetchData() {
      const res = await api.get(`Wagon/reportCurrents/${this.reportTimeStamp}`);
      if (res.status === 200) {
        this.reportTimeStamp = res.data.LastReportTimeStamp;
        this.ladingCheckTimeStamp = res.data.LastLadingCheckTimeStamp;
        this.trackCheckTimeStamp = res.data.LastTrackCheckTimeStamp;
        if (res.data?.Data.length > 0) this.data = res.data.Data;
      } else {
        if (res.status === 401) {
          this.router.push("/auth/login");
        }
      }
    },
  },
});
