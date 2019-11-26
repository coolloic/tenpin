import {GetterTree} from 'vuex';
import {DevicesState} from './types';
import {RootState} from '../types';

export const getters: GetterTree<DevicesState, RootState> = {
  listDevice: state => state.devices
};
