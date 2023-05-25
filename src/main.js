import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/global.css';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.use(router);

// Dodaj konfigurację Vue Toastification
const toastOptions = {
  timeout: 3500,
  position: 'top-center',
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
};
app.use(Toast, toastOptions);

app.mount('#app');