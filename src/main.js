import { createApp } from "vue/dist/vue.esm-bundler";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import "./style.css";
import App from "./App.vue";
import routes from "./routes";

const app = createApp(App);

// Store
const pinia = createPinia();
app.use(pinia);

// Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});
app.use(router);

app.mount("#app");
