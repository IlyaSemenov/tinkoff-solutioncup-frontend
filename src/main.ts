import "./plugins/chartjs"

import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"

import App from "@/App.vue"
import { load_store, store, watch_store_and_save } from "@/store"
import routes from "~pages"

const router = createRouter({
	history: createWebHistory(),
	routes,
})

load_store(store)
watch_store_and_save(store)

const app = createApp(App)
app.use(router)
app.mount("#app")
