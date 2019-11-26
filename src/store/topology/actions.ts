import {ActionTree} from 'vuex';
import axios from 'axios';
import {TopologyState, Device, FETCH_DEVICES, FETCH_DEVICES_ERROR, FETCH_MAP} from './types';
import {RootState} from '../types';

const FETCH_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/ne_50m_populated_places_simple.geojson';
const FETCH_US_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/us_cities.geojson';
const FETCH_WORLD_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/ne_10m_populated_places_simple.geojson';
const FETCH_WORLD_MAP_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/world-110m.geojson';
const FETCH_US_MAP_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/us-states.json';
const deviceUrl = (type: string) => {
  let url = '';
  switch (type) {
    case 'world_lg':
      url = FETCH_WORLD_DEVICES_URL;
      break;
    case 'us':
      url = FETCH_US_DEVICES_URL;
      break;
    case 'world':
    default:
      url = FETCH_DEVICES_URL;
      break;
  }
  return url;
};

const mapUrl = (type: string) => {
  let url = '';
  switch (type) {
    case 'us':
      url = FETCH_US_MAP_URL;
      break;
    case 'world':
    default:
      url = FETCH_WORLD_MAP_URL;
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
