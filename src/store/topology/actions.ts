import {ActionTree} from 'vuex';
import axios from 'axios';
import {TopologyState, Device, FETCH_DEVICES, FETCH_DEVICES_ERROR, FETCH_MAP} from './types';
import {RootState} from '../types';

const deviceUrl = (type: string) => {
  let url = '';
  switch (type) {
    case 'world_lg':
      url = 'http://localhost:3000/devices';
      break;
    case 'us':
      url = 'http://localhost:3000/devices';
      break;
    case 'world':
    default:
      url = 'http://localhost:3000/devices';
      break;
  }
  return url;
};

const mapUrl = (type: string) => {
  let url = '';
  switch (type) {
    case 'us':
      url = 'http://localhost:3000/map';
      break;
    case 'world':
    default:
      url = 'http://localhost:3000/map';
      break;
  }
  return url;
}
export const actions: ActionTree<TopologyState, RootState> = {
  fetchDevices: async ({commit}, state: 'us' | 'world' | 'world_lg' = 'world') => {
    await axios({
      url: deviceUrl(state)
    }).then((response) => {
      const payload: Device[] = response && response.data;
      commit(FETCH_DEVICES, payload);
    }, (error) => {
      console.log(error);
      commit(FETCH_DEVICES_ERROR);
    });
  },
  fetchMap: async ({commit}, state: 'us' | 'world' = 'world') => {
    await axios({
      url: mapUrl(state)
    }).then((response) => {
      const payload: string = response && response.data;
      commit(FETCH_MAP, payload);
    }, (error) => {
      console.log(error);
      commit(FETCH_MAP);
    });
  }
}
