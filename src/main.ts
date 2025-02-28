import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//pinia 持久化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

// main.ts注册所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//pinia 持久化
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
