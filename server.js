const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const axios = require('axios').default;

const FETCH_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/ne_50m_populated_places_simple.geojson';
const FETCH_WORLD_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/ne_10m_populated_places_simple.geojson';
const FETCH_US_DEVICES_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/us_cities.geojson';
const FETCH_WORLD_MAP_URL = 'https://loic-web-app.s3-ap-southeast-2.amazonaws.com/world-110m.geojson';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

const transformDevices = (response) => {
  let devices = [];
  if(response && response.data && response.data.features) {
    response.data.features.map(d => {
      devices.push({
        name: d.properties.name,
        latitude: d.properties.latitude,
        longitude: d.properties.longitude,
        x: 0,
        y: 0,
        data: {}})
    });
  }
  return devices;
}

app.get('/map', (req, res) => {
  axios({
    url: FETCH_WORLD_MAP_URL
  }).then((response) => {
    res.send(response.data)
  }, (error) => {
    console.log(error);
  });
})

app.get('/transdevices', (req, res) => {
  axios({
    url: FETCH_DEVICES_URL
  }).then((response) => {
    res.send(transformDevices(response.data))
  }, (error) => {
    console.log(error);
  });
})

app.get('/devices', (req, res) => {
  axios({
    url: FETCH_DEVICES_URL
  }).then((response) => {
    res.send(response.data)
  }, (error) => {
    console.log(error);
  });
})


http.listen(3000, () => {
  console.log('Listening on *:3000')
})
