import {Module} from 'vuex';
import {getters} from './getters';
import {actions} from './actions';
import {mutations} from './mutations';
import {state} from './state';
import {DevicesState} from './types';
import {RootState} from '../types';


const namespaced: boolean = true;

export const Devices: Module<DevicesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
