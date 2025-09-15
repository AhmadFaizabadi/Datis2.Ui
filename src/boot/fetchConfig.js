import { boot } from "quasar/wrappers";
import { config } from "src/config";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.config.globalProperties.$config = config;
  app.provide("config", config);
});
