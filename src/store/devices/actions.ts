import {ActionTree} from 'vuex';
import axios from 'axios';
import {DevicesState, Device, DEVICES_LOADED, DEVICES_ERROR} from './types';
import {RootState} from '../types';

const GET_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/ne_50m_populated_places_simple.geojson';
export const actions: ActionTree<DevicesState, RootState> = {
  fetchDevices: ({commit}): any => {
    axios({
      url: GET_DEVICES_URL
    }).then((response) => {
      const payload: Device[] = response && response.data;
      commit(DEVICES_LOADED, payload);
    }, (error) => {
      console.log(error);
      commit(DEVICES_ERROR);
    });
  }
};
