import {MutationTree} from 'vuex';
import {
  TopologyState,
  Device,
  FETCH_DEVICES,
  FETCH_DEVICES_ERROR,
  FETCH_MAP,
  FETCH_MAP_ERROR
} from './types';

export const mutations: MutationTree<TopologyState> = {
  [FETCH_DEVICES](state, payload: Device[]) {
    state.error = false;
    state.devices = payload;
  },
  [FETCH_DEVICES_ERROR](state) {
    state.error = true;
    state.devices = undefined;
  },
  [FETCH_MAP](state, payload: string) {
    state.error = false;
    state.map = payload;
  },
  [FETCH_MAP_ERROR](state) {
    state.error = true;
    state.devices = undefined;
  },
};
