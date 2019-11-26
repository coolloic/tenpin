import {ActionTree} from 'vuex';
import axios from 'axios';
import {TopologyState, Device, FETCH_DEVICES, FETCH_DEVICES_ERROR, FETCH_MAP} from './types';
import {RootState} from '../types';

const FETCH_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/ne_50m_populated_places_simple.geojson';
const FETCH_US_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/us_cities.geojson';
const FETCH_WORLD_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/ne_10m_populated_places_simple.geojson';
const FETCH_WORLD_MAP_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/world-110m.geojson';
const FETCH_US_MAP_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/us-states.json';
export const actions: ActionTree<TopologyState, RootState> = {
  fetchDevices: async ({commit}) => {
    await axios({
      url: FETCH_DEVICES_URL
    }).then((response) => {
      const payload: Device[] = response && response.data;
      commit(FETCH_DEVICES, payload);
    }, (error) => {
      console.log(error);
      commit(FETCH_DEVICES_ERROR);
    });
  },
  fetchMap: async ({commit}) => {
    await axios({
      url: FETCH_WORLD_MAP_URL
    }).then((response) => {
      const payload: string = response && response.data;
      commit(FETCH_MAP, payload);
    }, (error) => {
      console.log(error);
      commit(FETCH_MAP);
    });
  }
}
