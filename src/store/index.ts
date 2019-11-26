import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import {RootState} from "store/types";
import {Topology} from "./topology/index";

Vue.use(Vuex);
const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0'
  },
  modules: {
    Topology
  }
};
export default new Vuex.Store<RootState>(store);
