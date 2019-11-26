import {MutationTree} from 'vuex';
import {DevicesState, Device, DEVICES_LOADED, DEVICES_ERROR} from './types';

export const mutations: MutationTree<DevicesState> = {
  [DEVICES_LOADED](state, payload: Device[]) {
    state.error = false;
    state.devices = payload;
  },
  [DEVICES_ERROR](state) {
    state.error = true;
    state.devices = undefined;
  }
};
