<template lang="pug">
  .app
    .switch-field
      input(type="radio" id="radio-world" v-model="dataType" name="geo" value="0")
      label(for="radio-world") WORLD
        i(class="fas fa-spinner fa-spin" v-if="!isMounted && dataType == 0")
      input(type="radio" id="radio-world-lg" v-model="dataType" name="geo" value="1")
      label(for="radio-world-lg") WORLD LG
        i(class="fas fa-spinner fa-spin" v-if="!isMounted && dataType == 1")
      input(type="radio" id="radio-us" v-model="dataType" name="geo" value="2")
      label(for="radio-us") US
        i(class="fas fa-spinner fa-spin" v-if="!isMounted && dataType == 2")
    Networks(:map="mapSVG" :size="size" :device-collection="deviceCollection" :network-collection="networkCollection"
      :edge-collection="edgeCollection" v-if="isMounted" :cluster-radius="radius" :device-zoom-level="deviceZoomLevel" :projection-type="projection")
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Action, Getter} from 'vuex-class';
  import {Watch} from 'vue-property-decorator';
  import Component from 'vue-class-component'
  import * as d3 from 'd3';
  import Networks from '@/components/Networks.vue';
  import Device from '@/components/pojo/Device';
  import Network from '@/components/pojo/Network';
  import Edge from '@/components/pojo/Edge';
  import {Layer} from '@/components/pojo/Enums';

  const namespace: string = 'Topology';

  @Component({
    components: {
      Networks,
    },
  })

  export default class App extends Vue {
    @Getter('devices', {namespace}) listDevice: any;
    @Getter('map', {namespace}) map!: string;
    @Action('fetchMap', {namespace}) fetchMap: any;
    @Action('fetchDevices', {namespace}) fetchDevices: any;

    deviceCollection: any[] = [];

    edgeCollection: Edge[] = [];

    networkCollection: Network[] = [];

    projection: any;

    mapSVG = {};

    radius: number = 50;

    isMounted = false;

    message: string = '';
    deviceZoomLevel: number = 30;
    size = {
      width: 1800,
      height: 800,
    };
    dataType = 1;
    totalDevice = 1000;

    loadMap(mapUrl: string, dataUrl: string, callback: any) {
      Promise.all([d3.json(mapUrl), d3.json(dataUrl)]).then(callback);
    }

    mounted() {
      this.loadDataByType()
    }

    @Watch('dataType')
    onDataTypeChanged(value: any, oldValue: any) {
      this.loadDataByType(parseInt(value));
    }

    loadDataByType(type: number = 0) {
      let _ = this, data = '';
      this.isMounted = false;

      switch (type) {
        case 1:
          this.projection = 'world';
          data = 'world_lg';
          this.radius = 50;
          break;
        case 2:
          this.projection = 'us';
          data = 'us';
          this.radius = 5;
          this.deviceZoomLevel = 50;
          this.totalDevice = 1000;
          break;
        case 0:
        default:
          this.projection = 'world';
          this.radius = 50;
          data = 'world';
          break;
      }
      _.fetchDevices(data).then(() => _.fetchMap(this.projection)).then(() => {
        const worldMap = _.map;
        const devices = _.parseData(_.listDevice);
        const links = _.fakeLinks(devices);
        const hulls = _.fakeHulls(devices);
        this.mapSVG = {
          fill: 'lightgray',
          stroke: 'white',
          d: worldMap,
        };
        _.deviceCollection = devices;
        _.edgeCollection = links;
        _.networkCollection = hulls;
        _.isMounted = true;
      });
    }


    fakeHulls(devices: any = []) {
      const hulls: any = [];
      let counter = 1;
      let hullId = `VLAN-${counter}`;
      let deviceCollection: any = [];
      let
        hull;

      devices.map((d: any, i: number) => {
        if (counter % 5 == 0) {
          hull = {
            id: hullId,
            data: deviceCollection,
            text: hullId,
          };
          hulls.push(hull);
          deviceCollection = [];
          hullId = `VLAN-${counter}`;
        }
        d.hulls.push(hullId);
        deviceCollection.push(d);
        counter++;
      });
      return hulls;
    }

    fakeLinks(devices: Device[] = []) {
      const links: any = [];
      let link;
      let src: Device;
      let dest: Device;
      let id;
      const push = (src: Device, dest: Device, link: any) => {
        links.push(link);
        src.links!.push(link.id);
        dest.links!.push(link.id);
      };

      for (let i = 0; i < devices.length; i++) {
        src = devices[i];
        dest = devices[i + 1];
        if (src && dest) {
          link = {
            id: `${Layer.PHYSICAL}__${src.id}__${dest.id}`,
            source: src,
            target: dest,
            layer: Layer.PHYSICAL,
          };
          push(src, dest, link);
          link = {
            ...link,
            source: dest,
            target: src,
            id: `${Layer.PHYSICAL}__${dest.id}__${src.id}`,
          };
          push(src, dest, link);
          if (i % 1 == 0) {
            link = {
              ...link,
              source: src,
              target: dest,
              id: `${Layer.VLAN_LINK}__${dest.id}__${src.id}`,
              layer: Layer.VLAN_LINK,
            };
            push(src, dest, link);
            link = {
              ...link,
              source: src,
              target: dest,
              id: `${Layer.SYNC_LINK}__${src.id}__${dest.id}`,
              layer: Layer.SYNC_LINK,
            };
            push(src, dest, link);
            link = {
              ...link,
              source: dest,
              target: src,
              id: `${Layer.SYNC_LINK}__${dest.id}__${src.id}`,
              layer: Layer.SYNC_LINK,
            };
            push(src, dest, link);
          }
        }
      }
      return links;
    }

    parseData(cities: any): Device[] {
      const devices: any = [];
      let device: any;
      let data;
      data = cities.features.slice(0, this.totalDevice);
      data.map((c: any, index: number) => {
        // register node change subject
        device = new Device();
        device.id = `n${index}`;
        // text: c.name,,
        device.text = c.properties.city || c.properties.name || `n${index}`;
        device.geometry = {
          coordinates: c.geometry.coordinates,
        };
        device.point = c.geometry.coordinates;
        devices.push(device);
      });
      return devices;
    }
  }
</script>
<style lang="stylus">

  .font-icon
    font-family 'next-font'

  body
    font-family 'Roboto', sans-serif
    &.onMove
      cursor grabbing

  .ti-autocomplete ul
    max-height 200px !important
    overflow-x hidden !important

  .switch-field
    display flex
    margin-bottom 36px
    overflow hidden

  .switch-field input
    position absolute !important
    clip rect(0, 0, 0, 0)
    height 1px
    width 1px
    border 0
    overflow hidden

  .switch-field label
    background-color #e4e4e4
    color rgba(0, 0, 0, 0.6)
    font-size 14px
    line-height 1
    text-align center
    padding 8px 16px
    margin-right -1px
    border 1px solid rgba(0, 0, 0, 0.2)
    box-shadow inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1)
    transition all 0.1s ease-in-out

    i
      margin-left 5px

  .switch-field label:hover
    cursor: pointer;

  .switch-field input:checked + label
    background-color #07c
    color #fff
    box-shadow none

  .switch-field label:first-of-type
    border-radius 4px 0 0 4px

  .switch-field label:last-of-type
    border-radius 0 4px 4px 0
</style>
