import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
// @ts-ignore
// import * as io from 'socket.io-client'
// @ts-ignore
// import VueSocketIO from 'vue-socket.io';
import 'vuetify/dist/vuetify.min.css';
import './../iconfont/material-icons.css';
Vue.config.productionTip = false;
Vue.use(vuetify)
// Vue.use(VueSocketIO, io('http://localhost:3000'), store)
new Vue({
  router,
  store,
  // @ts-ignore
  vuetify,
  render: h => h(App),
}).$mount('#app');
