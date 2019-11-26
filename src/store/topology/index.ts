import {Module} from 'vuex';
import {getters} from './getters';
import {actions} from './actions';
import {mutations} from './mutations';
import {state} from './state';
import {TopologyState} from './types';
import {RootState} from '../types';


const namespaced: boolean = true;

export const Topology: Module<TopologyState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
