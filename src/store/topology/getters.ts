import {GetterTree} from 'vuex';
import {TopologyState} from './types';
import {RootState} from '../types';

export const getters: GetterTree<TopologyState, RootState> = {
  devices: state => state.devices,
  map: state => state.map
};
