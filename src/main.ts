import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
//pour persister le import
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { localhost } from './components/plugin/localhost'

//pour persist on crééer la constante pour l'utiliser
const pinia = createPinia(); //création de la constante
pinia.use(piniaPluginPersistedstate); //pour utiliser le plugin


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

//que l'on utilise dans l'app ! Merci Adeline!
app.use(pinia); 


import "./assets/main.css";








