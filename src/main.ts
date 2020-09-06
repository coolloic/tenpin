import Vue from 'vue';
import vuetify from './plugins/vuetify';
import router from './router';
import 'vuetify/dist/vuetify.min.css';
import './../iconfont/material-icons.css';
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.use(vuetify)
new Vue({
  router,
  // @ts-ignore
  vuetify,
  render: h => h(App),
}).$mount('#app');

