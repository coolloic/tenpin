<template lang="pug">
  .topology
    .float-panel: ul
      li#move(:class="(!enableBrush && !enableMultiSelect) ? 'on' : ''" @click="clickIcon('move')")
        i.fas.fa-arrows-alt
        label Move map
      li#zoom(:class="enableBrush ? 'on' : '' " @click="clickIcon('zoom')")
        i.fas.fa-search-plus
        label Zoom out region, Ctrl:on | ESC:off
      li#select(:class="multiSelectState" @click="clickIcon('select')")
        i.fas.fa-object-group
        label Select networks, Shift:on | ESC:off
      li#zoomOut(@click="clickIcon('zoomOut')")
        i.fas.fa-plus-square
        label Zoom out
      li#zoomIn(@click="clickIcon('zoomIn')").no-top
        i.fas.fa-minus-square
        label Zoom in
      li#fit(@click="clickIcon('fit')")
        i.fas.fa-expand-arrows-alt
        label Reset
    .topology-panel.left
      fieldset
        legend Toggle to show / hide layer
        .field(v-for="(value, name) in isLayerVisible")
          BaseToggleButton( :name="name" :value="value" :change-callback="onLayerSettingsChanged")
        .field
          BaseBadgeItem(:counter="this.validNetworks" text="Networks")
          BaseBadgeItem(:counter="this.validDevices" text="Devices")
          BaseBadgeItem(:counter="this.validEdges" text="Edges")
        .field
          vue-tags-input(
            v-model="tag"
            :tags="tags"
            placeholder="Filter Network"
            :autocomplete-items="filteredItems"
            @tags-changed="updateTags"
            add-only-from-autocomplete=true)
        hr(v-if='expandedNetworks.length > 0')
        .field.tag(v-for='networkId in expandedNetworks')
          label(
            @click="openNetworkById(networkId)"
            :title="'Locate '+ networkId") {{networkId}}
          i.fas.fa-times(
            @click.prevent="closeNetworkById(networkId)"
            :title="'Close ' + networkId"
            alt="close")
        .field.clear-all(
          v-if="expandedNetworks.length > 1"
          @click="cleanExpandedNetworks()"
          title="Close all networks")
          label Close All Networks
          i.fas.fa-times
    svg(:width="svg.width"
      :height="svg.height"
      :class="enableBrush || enableMultiSelect ? 'brush-enable' : ''")
      g.everything
        BaseArrowHeader(
          :r="r"
          :current-scale="currentScale")
        BaseGridAssist(
          v-if="showGrid"
          :width="this.svg.width"
          :height="this.svg.height"
          :clusterRange="clusterRange")
        BaseMapBackground(
          :fill="map.fill"
          :stroke="map.stroke"
          :path="mapPath")
        BaseBrushSelector(
          v-if="enableBrush || enableMultiSelect"
          :class="enableMultiSelect ? 'multiselect' : 'zoomselect'"
          :r ="r"
          :stroke-width="strokeWidth")
        BaseNetworkNode(
          v-for="network in clusters"
          :key="network.id"
          :id="network.id"
          :r="r"
          :stroke-width="strokeWidth"
          :font-size="fontSize"
          :network="network"
          :node-visible="isDeviceVisibleToScale"
          :click-callback='openNetworkById'
          :close-callback="closeNetworkById"
          :drag-callback="dragNetworkCallback")
        template(v-for="bundle in edges")
          BaseLinkItem(
            v-if="false && isEdgeVisibleToScale && isDeviceVisibleToScale && isLayerVisible[edge.layer] && edge.visible && edge.filtered"
            v-for="edge in bundle"
            :key="edge.id"
            :edge="edge"
            :stroke-width="strokeWidth"
            :mouseout-callback="supportingLinks"
            :mouseover-callback="supportingLinks"
            :font-size="fontSize")
          BaseEdgeBundle(
            v-if="bundle.data.size > 0 && isEdgeVisibleToScale && isDeviceVisibleToScale"
            :bundle="bundle.data"
            :stroke-width="strokeWidth"
            :isLayerVisible="isLayerVisible"
            :supportingLinks="supportingLinks"
            :font-size="fontSize"
            :r="r"
            :source="bundle.s"
            :target="bundle.t"
            :clickCallback="showPopover")
        BaseDeviceNode(
          v-if="isDeviceVisibleToScale && d.visible && d.filtered"
          v-for="d in devices"
          :class="d.class"
          :key="d.id"
          :id="d.id"
          :cx="d.cx"
          :cy="d.cy"
          :r="r"
          :fill="d.fill"
          :stroke-width="strokeWidth"
          :data="d.event"
          :font-size="fontSize"
          :text="d.text"
          :clickCallback="clickDevice"
          :dragCallback="dragDevice" type="pie")
</template>
<!--Node(:cx="device.cx" :cy="device.cy" :r="r" :stroke-width="strokeWidth" :key="device.id" :font-size="fontSize" :text="device.text")-->
<!--                        EventPie(:cx="device.cx" :cy="device.cy" :r="r" :stroke-width="strokeWidth" :key="device.id" :data="device.event" :font-size="fontSize" :text="device.text")-->
<script lang="ts">
  import {
    brush,
    event,
    geoAlbersUsa,
    geoNaturalEarth1,
    geoPath,
    polygonCentroid,
    polygonHull,
    scaleLinear,
    schemeCategory10,
    select,
    selectAll,
    zoom,
    zoomIdentity
  } from 'd3';
  import Vue from 'vue';
  import {Component, Prop, Watch,} from 'vue-property-decorator';
  import VueTagsInput from '@johmun/vue-tags-input';
  import Supercluster from "supercluster";
  import BaseDeviceNode from '@/components/basic/BaseDeviceNode.vue';
  import BaseNetworkNode from '@/components/basic/BaseNetworkNode.vue';
  import BaseLinkItem from '@/components/basic/BaseLinkItem.vue';
  import BaseBrushSelector from '@/components/basic/BaseBrushSelector.vue';
  import BaseMapBackground from '@/components/basic/BaseMapBackground.vue';
  import BaseGridAssist from '@/components/basic/BaseGridAssist.vue';
  import BaseArrowHeader from '@/components/basic/BaseArrowHeader.vue';
  import BaseBadgeItem from '@/components/basic/BaseBadgeItem.vue';
  import BaseToggleButton from '@/components/basic/BaseToggleButton.vue';
  import BaseEdgeBundle from '@/components/basic/BaseEdgeBundle.vue';
  import Device from '@/components/pojo/Device';
  import Network from '@/components/pojo/Network';
  import Edge from '@/components/pojo/Edge';
  import {Brush, Layer} from '@/components/pojo/Enums';

  @Component({
    components: {
      BaseEdgeBundle,
      BaseGridAssist,
      VueTagsInput,
      BaseNetworkNode,
      BaseDeviceNode,
      BaseLinkItem,
      BaseBrushSelector,
      BaseMapBackground,
      BaseArrowHeader,
      BaseBadgeItem,
      BaseToggleButton,
    },
  })

  export default class Networks extends Vue {
    validNetworks: number = 0;
    validDevices: number = 0;
    validEdges: number = 0;
    tags: any = [];
    tag: any = '';
    autocompleteItems = [];
    currentScale: number = 1;
    currentTranslate: any;
    active: any = select(null);
    scaleExtent: number = 1;
    entrySet: any = {};
    enableBrush: boolean = false;
    enableMultiSelect: boolean = false;
    boundary: any;
    brushType: Brush = Brush.EMPTY;
    edgeBundleEntry: any = {};
    isLayerVisible: any = (function () {
      const layer: any = {};
      Object.keys(Layer.valueOf()).map((k) => {
        layer[k] = true;
      });
      return layer;
    }());
    isDeviceVisibleToScale: boolean = false;
    isEdgeVisibleToScale: boolean = false;
    isNetworkVisibleToScale: boolean = false;
    brush = brush();
    selectedDevices = [];
    selectedNetworks = [];
    expandedNetworks: any[] = [];
    // load networks first using min radius before cluster
    initClusters: any = new Supercluster({
      radius: 0.00000001,
      maxZoom: this.clusterSettings.maxZoom,
    });
    popoverX: number = 0;
    popoverY: number = 0;
    @Prop() private networkCollection!: any;
    // Network Collection
    @Prop() private deviceCollection!: any;
    // Device Collection
    @Prop() private edgeCollection!: any;
    // Edge Collection
    @Prop() private projectionType!: string;
    // Project type, e.g US, World
    @Prop() private deviceZoomLevel!: number;
    // Zoom level to show devices and edges, 15 by default
    @Prop() private zoomMin!: number;
    // Minimum zoom level for map, 1 by default
    @Prop() private zoomMax!: number;
    // Maximum zoom level for map, 300 by default
    @Prop() private clusterRadius!: number;
    // Cluster radius size to aggregate the networks
    @Prop() private clusterMaxZoom!: number;
    // Cluster maximum zoom level, 30 by default
    @Prop() private zoomTransition!: number;
    // Zoom transition duration, 300 by default
    @Prop() private gridOn!: boolean;
    // Show assist grid, false by default
    @Prop() private gridCellSize!: number;
    // Grid cell width
    @Prop() private map!: any;
    // Map svg
    @Prop() private size!: { width: number, height: number };
    // default width 960, height 500
    @Prop() private disalbeMultiSelectZoomLevel!: number;

    get multiSelectState() {
      const disabled = this.enableSelect ? '' : 'disabled';
      const on = this.enableMultiSelect ? 'on' : '';
      return `${disabled} ${on}`;
    }

    get clusterRange() {
      return this.gridCellSize || 45;
    }

    get zoomIndentity() {
      return zoomIdentity;
    }

    get zoom(): any {
      return zoom().scaleExtent([this.zoomSettings.scaleMin, this.zoomSettings.scaleMax]);
    }

    // settings for lazy load edges and devices, text switch between counter and network name for network
    get scaleSettings() {
      return {
        edgeScaleExtentToShow: this.deviceLevel,
        deviceScaleExtentToShow: this.deviceLevel,
        networkScaleExtendToShow: this.deviceLevel,
      };
    }


    // @Watch('selectedNetworks', {deep: true})
    // onSelectedNetworksChanged(value: any, old: any) {
    //     let points: any[] = [], _ = this, hullPoints: any, d;
    //     value.map((id: string) => {
    //         let n = _.entrySet[id]
    //         if (n.multiSelected)
    //             points.push(n.center);
    //     });
    //     hullPoints = d3.polygonHull(points);
    //     if (hullPoints && hullPoints.length > 1) {
    //         d = `M${hullPoints.join('L')}Z`;
    //         d3.select('.temphull').attr('d', d).attr('stroke-width', _.r);
    //     } else {
    //         d3.select('.temphull').attr('d', '');
    //     }
    // }

    get clusterSettings() {
      return {
        radius: this.clusterRadius || 50,
        maxZoom: this.clusterMaxZoom || 30,
      };
    }

    get deviceLevel() {
      return this.deviceZoomLevel > this.zoomSettings.scaleMax ? this.zoomSettings.scaleMax : this.deviceZoomLevel || 15;
    }

    get path() {
      return geoPath().projection(this.projection);
    }

    get clusterScale() {
      return scaleLinear().domain([1, 90]).range([1, 15]);
    }

    get nodeSizeScale() {
      return scaleLinear().domain([1, 90]).range([8, 12]);
    }

    get zoomSettings() {
      return {
        scaleMin: this.zoomMin || 1,
        scaleMax: this.zoomMax || 300,
      };
    }

    get svg() {
      return this.size || {
        width: 960,
        height: 500,
      };
    }

    get duration() {
      return this.zoomTransition || 300;
    }

    get showGrid() {
      return this.gridOn || false;
    }

    get projection() {
      return this.projectionType == 'us' ? geoAlbersUsa() : geoNaturalEarth1();
    }

    // insentive tag input comparation
    get filteredItems() {
      return this.autocompleteItems.filter((i: any) => i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1);
    }

    // return projected map svg path
    get mapPath() {
      return this.path(this.map.d);
    }

    get clusters() {
      const data = this.getClusters(this.networks.filter((n: Network) => n.filtered), this.scaleExtent);
      this.refreshViaScale();
      return data;
    }

    populateDevice(d: Device, i: number, counter: number) {
      // exclude the points which isn't belong this current projection
      if (this.projection!(d.point)!) {
        d.cx = d.cx || this.projection(d.point)![0];
        d.cy = d.cy || this.projection(d.point)![1];
        d.class = `${d.hulls!.join(' ')} ${d.active ? 'active' : ''}` || '';
        d.r = d.r || 0.1;
        d.fill = d.fill || this.c10(i);
        d.fontSize = d.fontSize || 1;
        d.visible = d.visible == null ? false : d.visible;
        d.filtered = d.filtered == null ? true : d.filtered;
        d.event = d.event || this.generateEvent();
        this.entrySet[d.id!] = this.entrySet[d.id!] || d;
        this.isDeviceFiltered(d);
      } else {
        counter++;
      }
      return counter;
    }


    // return computed devices
    get devices() {
      const _ = this;
      let counter = 0;
      this.deviceCollection.map((d: Device, i: number) => {
        counter = _.populateDevice(d, i, counter);
      });
      this.validDevices = this.deviceCollection.length - counter;
      // console.log(`invalid edge ${counter}, valid edge ${this.deviceCollection.length}`);
      return this.deviceCollection;
    }

    populateNetworks(n: Network, i: number, counter: number, scale: number) {
      let path = this.networkPath(n);
      // exclude the points which isn't belong this current projection
      if (path && path.center) {
        n.center = path.center || [0, 0];
        n.toppoint = path.toppoint || [0, 0],
          n.d = path.d || '';
        n.stroke = this.c10(i);
        n.fill = this.c10(i);
        n.strokeWidth = n.strokeWidth! / scale || 20;
        n.d0 = `M ${n.center[0]} ${n.center[1]} m ${-5 / scale} 0 a ${5 / scale} ${5 / scale} 0 0 0 ${10 / scale} 0 a ${5 / scale} ${5 / scale} 0 0 0 ${-10 / scale} 0` || '';
        n.stroke = n.stroke || 'white';
        n.fill = n.fill || 'white';
        n.expanded = n.expanded == null ? false : n.expanded;
        n.geometry = {
          coordinates: this.projection.invert!(path.center!),
        };
        n.x = n.x || 0;
        n.y = n.y || 0;
        n.event = n.event || this.generateEvent();
        n.counter = n.data!.length || 0;
        n.filtered = n.filtered == null ? true : n.filtered;
        n.highlight = n.highlight == null ? false : n.highlight;
        n.points = path.points;
        this.entrySet[n.id!] = this.entrySet[n.id!] || n;
      } else {
        counter++;
      }
      return counter;
    }

    // return computed network
    get networks(): Network[] {
      const _ = this;
      const scale = this.currentScale / 1.5;
      let counter = 0;
      this.networkCollection.map((n: Network, i: number) => {
        counter = _.populateNetworks(n, i, counter, scale);
      });
      this.validNetworks = this.networkCollection.length - counter;
      // console.log(`invalid network ${counter}, valid network ${this.networkCollection.length}`);
      return this.networkCollection;
    }

    get enableSelect() {
      const level = this.disalbeMultiSelectZoomLevel || 1;
      return level < this.currentScale;
    }

    get strokeWidth() {
      return 2 / this.currentScale;
    }

    get highlightStrokeWidth() {
      return 6 / this.currentScale;
    }

    get fontSize() {
      return 10 / this.currentScale;
    }

    get r() {
      return 20 / this.currentScale;
    }

    get clusterOption() {
      return new Supercluster({
        radius: this.clusterSettings.radius,
        maxZoom: this.clusterSettings.maxZoom,
      });
    }

    populateEdge(e: Edge, counter: number) {
      // exclude the points which isn't belong this current projection
      if (this.projection(e.source!.point)! && this.projection(e.target!.point)!) {
        const set = new Set<string>();
        e.source!.hulls!.map((d: string) => {
          if (d) set.add(d);
        });
        e.target!.hulls!.map((d: string) => {
          if (d) set.add(d);
        });
        e.id = e.id || `${e.layer}__${e.source!.id}__${e.target!.id}`;
        e.hulls = set;
        e.class = `link ${e.source!.id} ${e.target!.id}`;
        e.d = this.linkPath(e) || '';
        e.arrow = `url(#arrow-${e.layer})`;
        e.x1 = e.source!.cx || 0;
        e.y1 = e.source!.cy || 0;
        e.x2 = e.target!.cx || 0;
        e.y2 = e.target!.cy || 0;
        e.bidirectional = e.bidirectional || false;
        e.strokeWidth = e.strokeWidth || 0.1;
        e.icons = this.getIcons(e.layer!);
        e.arrow = e.arrow || '';
        e.visible = e.visible == null ? false : e.visible;
        e.filtered = e.filtered == null ? true : e.filtered;
        e.text = e.text || e.id;
        this.updateEdgeBundles(e);
        this.isEdgeFiltered(e);
      } else {
        counter++;
      }
      return counter;
    }

    // return computed edges
    get edges() {
      const _ = this;
      let
        counter = 0;
      this.edgeCollection.map((e: Edge) => {
        counter = _.populateEdge(e, counter);
      });
      this.validEdges = this.edgeCollection.length - counter;
      // console.log(`invalid edge ${counter}, valid edge ${this.edgeCollection.length}`);
      return Object.values(this.edgeBundleEntry);
    }

    // auto color panel
    c10 = (i: number) => schemeCategory10[i % 10];

    created() {
      // load networks to tags input auto suggestion
      this.networks.map((n: Network) => {
        this.autocompleteItems.push({text: n.text});
      });
    }

    mounted() {
      // register zoom behaviour
      this.registerZoomBehaviour(select('svg'));
      this.registerBrush();
      // set initClusters to null to load cluster view
      this.initClusters = null;
    }

    updated() {
      // activate zoom
      if (this.enableBrush) {
        this.activateZoom();
      } else {
        this.boundary = null;
      }
      // activate multi select
      if (this.enableMultiSelect) {
        this.activateMultiSelect();
      }

      //  remove unfocused network opacity when zoom out
      if (this.currentScale < this.deviceLevel && select('.low-opacity')) {
        selectAll('.low-opacity').classed('low-opacity', false);
      }
    }

    @Watch('currentScale')
    onCurrentScaleChanged() {
      if (!this.enableSelect && this.enableMultiSelect) {
        this.enableMultiSelect = false;
      }
    }

    generateEvent() {
      return [
        {
          fill: '#BFB', stroke: '#070', level: 'Normal', number: Math.floor(Math.random() * 50),
        },
        {
          fill: '#FF3', stroke: '#D80', level: 'Warning', number: Math.floor(Math.random() * 50),
        },
        {
          fill: '#FA0', stroke: '#B60', level: 'Critical', number: Math.floor(Math.random() * 50),
        },
      ];
    }

    // check device's parent network filter status
    isDeviceFiltered(d: Device) {
      const _ = this;
      if (_.tags.length > 0) {
        d.hulls!.map((h: string) => {
          let isMatched = false;
          _.tags.map((t: any) => {
            if (h == t.text) {
              isMatched = true;
            }
          });
          d.filtered = isMatched;
        });
      } else {
        d.filtered = true;
      }
    }

    insideBoundary(p: any) {
      const b = this.boundary;
      const [x1, y1, x2, y2] = [b[0][0], b[0][1], b[1][0], b[1][1]];
      const [x, y] = [p.cx, p.cy];
      return (x > x1 && x < x2 && y > y1 && y < y2);
    }

    // if the point in inside boundary , then reverse the multiselected state and update selected networks
    updateSelectedNetworks(p: any) {
      const _ = this;
      if (_.insideBoundary(p)) {
        p.multiSelected = !p.multiSelected;
        if (p.multiSelected && p.id) {
          _.selectedNetworks.push(p.id);
        } else {
          _.selectedNetworks = _.selectedNetworks.filter((d: string) => d != p.id);
        }
      }
    }

    updateSelectedDevice() {
      const _ = this;
      let
        network;
      this.expandedNetworks.map((id: string) => {
        network = _.entrySet[id];
        network.data.map((d: Device) => {
          if (_.insideBoundary(d)) {
            _.refreshActiveDevice(d, false);
          }
        });
      });
    }

    getClusters(points: any, zoom: number = 1) {
      const allClusters: any[] = [];
      const
        _ = this;

      // Cluster each group individually
      const index = this.initClusters || this.clusterOption;
      // this.brushType has to be called to get the latest brushType
      if (this.brushType && this.boundary && this.brushType == Brush.ZOOM) {
        points = points.filter((p: any) => _.insideBoundary(p));
      } else if (this.boundary && this.brushType == Brush.MULTI_SELECT && (this.expandedNetworks.length < 1)) {
        points.map((p: any) => this.updateSelectedNetworks(p));
      } else if (this.boundary && this.brushType == Brush.MULTI_SELECT && this.expandedNetworks.length > 0) {
        // TODO multiselect devices
        this.updateSelectedDevice();
      }
      index.load(points);
      index.getClusters([-180, -90, 180, 90], zoom).forEach((cluster: any, index: number) => {
        // Add x, y, r, and state properties to each cluster
        const [x, y] = this.projection(cluster.geometry.coordinates) || [0, 0];
        cluster.cx = x;
        cluster.cy = y;
        cluster.r = _.nodeSizeScale(cluster.properties && cluster.properties.point_count ? cluster.properties.point_count : 4) / this.scaleExtent;
        cluster.color = this.c10(index);
        allClusters.push(cluster);
      });
      return allClusters;
    }

    getIcons(layer: Layer) {
      const icons: any[] = [];
      switch (layer) {
        case Layer.SYNC_LINK:
          icons.push({
            fill: '#70C',
            icon: ' &#xf021',
          });
          break;
        case Layer.VLAN_LINK:
          icons.push({
            fill: '#70C',
            icon: ' &#xf1eb',
          });
          break;
        case Layer.PHYSICAL:
        default:
          icons.push({
            fill: '#70C',
            icon: ' &#xf127',
          });
          icons.push({
            fill: 'red',
            icon: ' &#xf0c1',
          });
          break;
      }
      return icons;
    }

    updateEdgeBundles(e: Edge) {
      const id = `${e.source!.id}_${e.target!.id}`;
      const id1 = `${e.target!.id}_${e.source!.id}`;
      if (this.edgeBundleEntry[id]) {
        this.edgeBundleEntry[id].data.add(e);
      } else if (this.edgeBundleEntry[id1]) {
        this.edgeBundleEntry[id1].data.add(e);
      } else {
        const set = new Set<any>();
        set.add(e);
        this.edgeBundleEntry[id] = {data: set, s: e.source, t: e.target};
      }
    }

    // check edge's parent network filter status
    isEdgeFiltered(e: Edge) {
      const _ = this;
      if (_.tags.length > 0) {
        e.hulls!.forEach((h: string) => {
          let isMatched = false;
          _.tags.map((t: any) => {
            if (t.text == h) {
              isMatched = true;
            }
          });
          e.filtered = isMatched;
        });
      } else {
        e.filtered = true;
      }
    }

    // high light edge's support layer edges
    supportingLinks(edge: Edge, highlight: boolean = true) {
      edge.highlight = highlight;
      const [sid, tid, layer] = [edge.source!.id, edge.target!.id, edge.layer];
      let selector: string = '';
      const sw = highlight ? this.highlightStrokeWidth : this.strokeWidth;
      const sd = highlight ? this.highlightStrokeWidth : 0;
      switch (layer) {
        case Layer.VLAN_LINK:
          selector = `.${sid}.${tid}[layer=${Layer.PHYSICAL}]`;
          break;
        case Layer.SYNC_LINK:
          selector = `#${Layer.PHYSICAL}__${tid}__${sid}`;
        case Layer.PHYSICAL:
        default:
          break;
      }
      if (selector) {
        selectAll(selector).classed('highlight', highlight).attr('stroke-width', sw).attr('stroke-dasharray', sd);
      }
    }

    // layer setting change callback
    onLayerSettingsChanged(event: any) {
      const value: boolean = event.target.checked;
      const {name} = event.target;
      this.isLayerVisible[name] = value;
    }

    refreshViaScale() {
      this.currentScale = this.currentScale + 0.00000001;
    }

    cleanSelectedNetworks() {
      this.enableMultiSelect = false;
      this.selectedNetworks.map((id: string) => {
        this.entrySet[id].multiSelected = false;
      });
      this.selectedNetworks = [];
    }

    cleanSelectedDevices() {
      this.selectedDevices.map((id: string) => {
        this.entrySet[id].active = false;
      });
      this.selectedDevices = [];
    }

    cleanExpandedNetworks() {
      let net: Network;
      this.expandedNetworks.map((id: string) => {
        net = this.entrySet[id];
        this.closeNetwork(net, false);
      });
      this.expandedNetworks = [];
    }

    relayoutDevice(g: any, d: Device, x: number, y: number) {
      d.cx! += x;
      d.cy! += y;
      this.freshAssociatedLinks(d);
    }

    zoomed(scale: number) {
      const translate = [0, 0];
      select('svg').transition()
        .call(this.zoom.transform, this.zoomIndentity.translate(translate[0], translate[1]).scale(scale));
    }

    private relayoutNetwork(net: Network, x: number, y: number) {
      const devices = net.data;
      const hulls = new Set();
      net.center = [net.center[0] + x, net.center[1] + y];
      devices!.map((d: Device) => {
        d.cx! += x;
        d.cy! += y;
        select(`#${d.id} circle`).raise();
        select(`#${d.id} text`).raise();

        this.freshAssociatedLinks(d);
        d.hulls!.map((h: string) => {
          hulls.add(h);
        });
      });
      hulls.forEach((id: any) => {
        select(`#${id} path`).attr('d', this.isDeviceVisibleToScale ? this.networkPath(this.entrySet[id])!.d : this.entrySet[id].d0);
      });
      if (event.sourceEvent) {
        event.sourceEvent.stopImmediatePropagation();
      }
    }

    dragNetworkCallback(id: any, x: number, y: number) {
      const network = select(`#${id}`)!;
      if (id) {
        const net = this.entrySet[id];
        if (net.multiSelected) {
          const {length} = this.selectedNetworks;
          this.selectedNetworks.map((id: string, i: number) => {
            const n = this.entrySet[id];
            if (n.multiSelected) {
              this.relayoutNetwork(n, x, y);
            }
          });
        } else {
          this.relayoutNetwork(net, x, y);
        }
        network.raise();
      }
    }

    // raise z-index of network and its child devices
    private raiseNetwork(network: Network) {
      select('.emphasis').classed('emphasis', false);
      select(`#${network.id}`).raise().classed('emphasis', true);

      network.data!.map((d: Device) => {
        select(`#${d.id}`).raise();
      });
    }

    // collapse network
    private collapseNetwork(network: Network) {
      const _ = this;
      network.expanded = false;
      network.data!.map((d: Device) => {
        d.visible = false;
        d.links!.map((id: string) => {
          const link = _.entrySet[id];
          let isValidSrc;
          let isValidTarget;
          let src;
          let
            dest;
          if (link && link.source && link.target) {
            src = link.source;
            dest = link.target;
            isValidSrc = network.data!.indexOf(src) != -1;
            isValidTarget = network.data!.indexOf(dest) != -1;
            link.visible = !(isValidSrc || isValidTarget);
          }
        });
      });
      this.expandedNetworks = this.expandedNetworks.filter((id: string) => id != network.id);
    }

    // expand network
    private expandNetwork(network: Network) {
      const _ = this;
      if (!network.expanded) {
        network.expanded = true;
        _.expandedNetworks.push(network.id);
        network.data!.map((d: Device) => {
          d.visible = true;
          d.links!.map((id: string) => {
            const link = _.entrySet[id];
            let src;
            let dest;
            let isValidSrc;
            let
              isValidTarget;
            if (link && link.source && link.target) {
              src = link.source;
              dest = link.target;
              isValidSrc = network.data!.indexOf(src) != -1;
              isValidTarget = network.data!.indexOf(dest) != -1;
              link.visible = isValidSrc && isValidTarget;
              // TODO show edge shared between multiple networks when expanded
              // if (!link.visible && d.id == src.id) {
              //     let isNetworkExpanded = false;
              //     _.entrySet[src.id].hulls((key: string) => {
              //         debugger;
              //         if (_.entrySet[key].expanded)
              //             isNetworkExpanded = true;
              //     });
              //     link.visible = isNetworkExpanded
              // } else if (!link.visible && d.id == dest.id) {
              //     let isNetworkExpanded = false;
              //     _.entrySet[dest.id].hulls((key: string) => {
              //         if (_.entrySet[key].expanded)
              //             isNetworkExpanded = true;
              //     });
              //     link.visible = isNetworkExpanded;
              // }
            }
          });
        });
        _.entrySet = [];
      }
    }

    private closeNetworkById(id: string) {
      this.closeNetwork(this.entrySet[id]);
    }

    private closeNetwork(network: Network, trans: boolean = true) {
      const {width} = this.svg;
      const {height} = this.svg;
      const x = network.center[0];
      const y = network.center[1];
      const scale = this.deviceZoomLevel - 10;
      let translate;

      select(`#${network.id}`).classed('emphasis', false);
      // scale = this.scaleSetti  ngs.deviceScaleExtentToShow;
      translate = [width / 1.5 - scale * x, height / 1.5 - scale * y];
      this.collapseNetwork(network);
      if (trans) {
        select('svg').transition()
          .duration(this.duration)
          .call(this.zoom.transform, this.zoomIndentity.translate(translate[0], translate[1]).scale(scale));
      }
    }

    private openNetworkById(id: string) {
      this.openNetwork(this.entrySet[id]);
    }

    // click the network to zoom out and load the devices and links
    private openNetwork(network: Network) {
      const _ = this;
      const x = network.center[0];
      const y = network.center[1];
      const {width} = this.svg;
      const {height} = this.svg;
      let scale = 1;
      let translate;
      const emphasis = select(`#${network.id}`).classed('emphasis');
      if (emphasis) {
        return;
      }
      // if device scaled to show
      if (!this.isDeviceVisibleToScale || (this.isDeviceVisibleToScale && !network.expanded) || (network.expanded && !emphasis)) {
        // if edge is visible then show edges directly when click another network
        scale = this.isEdgeVisibleToScale ? this.scaleSettings.edgeScaleExtentToShow : this.scaleSettings.deviceScaleExtentToShow;
        scale += 1,
          translate = [width / 1.5 - scale * x, height / 1.5 - scale * y];
        select('svg').transition()
          .duration(this.duration)
          .call(this.zoom.transform, this.zoomIndentity.translate(translate[0], translate[1]).scale(scale));
        // if network hasn't been expanded then load associated device and edges
        this.expandNetwork(network);
        // if network has already been expanded, then collapse network
      } else if (network.expanded && !emphasis) {
        select(`#${network.id}`).classed('emphasis', false);
        // scale = this.scaleSettings.deviceScaleExtentToShow;
        translate = [width / 1.5 - scale * x, height / 1.5 - scale * y];
        select('svg').transition()
          .duration(this.duration)
          .call(this.zoom.transform, this.zoomIndentity.translate(translate[0], translate[1]).scale(scale));
      }
      // raise the z-index for network
      setTimeout(() => {
        _.raiseNetwork(network);
      }, 300);
    }

    private activateMultiSelect() {
      const _ = this;
      this.brush.on('end', () => {
        if (event.selection) {
          _.boundary = event.selection;
          _.brushType = Brush.MULTI_SELECT;
          setTimeout(() => {
            _.enableMultiSelect = false;
            _.brushType = Brush.EMPTY;
            _.boundary = [];
          }, 300);
        }
      })(select('g.brush'));
    }

    private activateZoom() {
      // const svgBounds = d3.select('svg').node().getBoundingClientRect();
      const _ = this;
      const {width} = this.svg;
      const {height} = this.svg;
      let currMapScale = this.currentScale;
      let currMapTranslate = this.currentTranslate;
      this.brush.on('end', () => {
        if (event.selection) {
          const extent = event.selection;
          const dx = extent[1][0] - extent[0][0];
          const dy = extent[1][1] - extent[0][1];
          const x = (extent[0][0] + extent[1][0]) / 2;
          const y = (extent[0][1] + extent[1][1]) / 2;

          currMapScale = Math.max(
            1,
            Math.min(_.zoomSettings.scaleMax, 0.9 / Math.max(dx / width, dy / height)),
          );

          currMapTranslate = [
            (width / 2) - (currMapScale * x),
            (height / 2) - (currMapScale * y),
          ];

          select('svg').transition()
            .duration(_.duration)
            .call(_.zoom.transform, _.zoomIndentity.translate(currMapTranslate[0], currMapTranslate[1]).scale(currMapScale));
          _.boundary = extent;
          _.brushType = Brush.ZOOM;
        }
      })(select('g.brush'));
    }

    private registerBrush() {
      const _ = this;
      select('body').on('keydown', () => {
        if (event.ctrlKey) {
          _.enableMultiSelect = false;
          _.enableBrush = !_.enableBrush;
        } else if (event.shiftKey && this.enableSelect) {
          _.enableBrush = false;
          setTimeout(() => _.enableMultiSelect = !_.enableMultiSelect, 300);
        } else if (event.code == 'Escape') {
          if (_.enableBrush) {
            _.enableBrush = false;
          } else if (_.selectedNetworks.length > 0) {
            _.cleanSelectedNetworks();
          } else if (_.selectedDevices) {
            _.cleanSelectedDevices();
          }
          _.boundary = null;
          _.refreshViaScale();
        }
      });
    }

    // Zoom behaviour for map
    private registerZoomBehaviour(selector: any) {
      const _ = this;
      const all = select('.everything');
      this.zoom.on('zoom', () => {
        const scale = event.transform.k;
        const edgeScaleExtent = scale > _.scaleSettings.edgeScaleExtentToShow;
        const deviceScaleExtent = scale > _.scaleSettings.deviceScaleExtentToShow;
        const networkScaleExtent = scale > _.scaleSettings.networkScaleExtendToShow;
        all.attr('transform', event.transform);
        if (Math.abs(scale - _.currentScale) < 0.001)
          return;
        _.currentScale = scale;
        _.currentTranslate = [event.transform.x, event.transform.y];
        // update edge and device visibility according to scale
        _.isNetworkVisibleToScale = networkScaleExtent;
        _.scaleExtent = Math.ceil(_.clusterScale(scale));
        if (!_.isDeviceVisibleToScale && deviceScaleExtent) {
          _.isDeviceVisibleToScale = true;
        } else if (_.isDeviceVisibleToScale && !deviceScaleExtent) {
          // clean the expanded networks when zoom in
          // _.cleanExpandedNetworks();
          _.isDeviceVisibleToScale = false;
        }

        if (!_.isEdgeVisibleToScale && edgeScaleExtent) {
          _.isEdgeVisibleToScale = true;
        } else if (_.isEdgeVisibleToScale && !edgeScaleExtent) {
          _.isEdgeVisibleToScale = false;
        }
      })(selector);
    }

    // reset the device scale
    private reset(width: number, height: number, d: Device) {
      this.active.classed('active', false);
      this.active = select(null);
      const scale = this.scaleSettings.deviceScaleExtentToShow + 1;
      const translate = [width / 1.5 - scale * d.cx!, height / 1.5 - scale * d.cy!];

      select('svg').transition()
        .duration(this.duration)
        .call(this.zoom.transform, this.zoomIndentity.translate(translate[0], translate[1]).scale(scale));
    }

    private refreshActiveDevice(d: Device, clean: boolean = true) {
      if (clean) {
        this.selectedDevices.map((id: string) => this.entrySet[id].active = false);
        this.selectedDevices = [];
      }
      d.active = !d.active;
      if (d.active) {
        this.selectedDevices.push(d.id);
      } else {
        this.selectedDevices = this.selectedDevices.filter((id: string) => id != d.id);
      }
    }

    private clickDevice(id: string) {
      const $ = select(`#${id}`).raise();
      const d = this.entrySet[id];
      let scale;
      let translate;
      const width = this.svg.width || 960;
      const height = this.svg.height || 500;
      // if device is active then reset otherwise update the device style
      if (this.active.node() === this) return this.reset(width, height, d);
      this.refreshActiveDevice(d);
      // scale to show edges
      scale = this.currentScale;
      translate = [width / 2 - scale * d.cx, height / 2 - scale * d.cy];
      select('svg').transition()
        .call(this.zoom.transform, this.zoomIndentity.translate(translate[0], translate[1]).scale(scale));
    }

    private zoomIn(d: any) {
      let scale: any;
      let translate: any;
      const _ = this;
      const width = _.svg.width || 960;
      const
        height = _.svg.height || 500;
      scale = Math.ceil(this.currentScale + 6);
      translate = [width / 1.5 - scale * d.cx, height / 1.5 - scale * d.cy];
      select('svg').transition()
        .duration(_.duration)
        .call(_.zoom.transform, _.zoomIndentity.translate(translate[0], translate[1]).scale(scale));
    }

    // register device drag behaviour
    private dragDevice(id: string, dx: number, dy: number) {
      const g = select(`#${id}`);
      let d = this.entrySet[id];
      g.raise();
      if (this.selectedDevices.length > 0 && this.selectedDevices.indexOf(id) != -1) {
        this.selectedDevices.map((key: string) => {
          d = this.entrySet[key];
          if (d) {
            this.relayoutDevice(select(`#${key}`), d, dx, dy);
          }
        });
      } else {
        this.relayoutDevice(g, d, dx, dy);
      }

      event.sourceEvent.stopImmediatePropagation();
    }

    // refresh associated edges for device, only refresh device associated links
    private freshAssociatedLinks(d: Device) {
      const _ = this;
      const
        id = d.id!;
      selectAll(`.${id}`).attr('d', function () {
        const $ = select(this);
        const sid = $.attr('sid');
        const tid = $.attr('tid');
        const arc = $.attr('arc');
        const l = _.entrySet[id];
        l.source = _.entrySet[sid];
        l.target = _.entrySet[tid];
        l.arc = arc;
        if (sid === id) {
          l.x1 = d.cx;
          l.y1 = d.cy;
        } else {
          l.x2 = d.cx;
          l.y2 = d.cy;
        }
        return _.linkPathCalcFn(l);
      }).raise();
    }

    // get default arc for layers
    private arcFn(d: any) {
      const {layer} = d;
      let arc = 0;
      switch (layer) {
        case Layer.PHYSICAL:
          arc = 3;
          break;
        case Layer.SYNC_LINK:
        case Layer.RT_LINK:
          arc = 1.4;
          break;
        case Layer.TE_LINK:
        case Layer.PTP_LINK:
          arc = 1;
          break;
        case Layer.TE_TUNNEL:
          arc = 0.8;
          break;
        case Layer.VLAN_LINK:
        case Layer.PW:
        default:
          arc = 0;
          break;
      }
      return arc;
    }

    // generate arc path with arc and two coordinates
    private pathFn(args: any) {
      const [x1, y1, arc, x2, y2] = [...args];
      return `M${x1},${y1}A${arc},${arc} 0 0,1${x2},${y2}`;
    }

    // calculate the arc
    private linkPathCalcFn(e: Edge) {
      let diffX: number;
      let diffY: number;
      let arc;
      let x1;
      let y1;
      let x2;
      let y2;
      let
        path;
      // Total difference in x and y from source to target
      e.x1 = e.source!.cx || this.projection(e.source!.point)![0];
      e.y1 = e.source!.cy || this.projection(e.source!.point)![1];
      e.x2 = e.target!.cx || this.projection(e.target!.point)![0];
      e.y2 = e.target!.cy || this.projection(e.target!.point)![1];
      diffX = e.x2 - e.x1;
      diffY = e.y2 - e.y1;
      // Length of path from center of source node to center of target node
      [x1, y1, x2, y2] = [e.x1, e.y1, e.x2, e.y2];
      arc = (n: number) => Math.sqrt(diffX * diffX + diffY * diffY) * n;
      if (e.arc === 0) {
        path = `M${x1},${y1}L${x2},${y2}`;
      } else {
        path = this.pathFn([x1, y1, arc(e.arc!), x2, y2]);
      }
      return path;
    }

    // generate arc path
    private linkPath(e: Edge) {
      e.arc = this.arcFn(e);
      return this.linkPathCalcFn(e);
    }

    // generate network path by device points
    private networkPath(n: Network) {
      const _ = this;
      const points: any[] = [];
      let hullPoints: any;
      let centerid: any;
      let
        toppoint: any;
      n.data!.map((d: Device) => {
        if ((_.projection(d.point))) {
          points.push([d.cx || _.projection(d.point)![0], d.cy || _.projection(d.point)![1]]);
        }
      });
      if (points.length < 1) {
        // console.log('Network is unavailable');
        return;
      }
      hullPoints = polygonHull(points);
      if (hullPoints) {
        centerid = polygonCentroid(hullPoints)!;
        toppoint = hullPoints[0];
        hullPoints.map((p: any) => {
          toppoint = toppoint[1] > p[1] ? p : toppoint;
        });
      }
      if (centerid && isNaN(centerid[0])) {
        centerid = hullPoints[0];
      }
      return {
        center: centerid,
        d: hullPoints ? `M${hullPoints.join('L')}Z` : null,
        toppoint,
        points,
      };
    }

    private clickIcon(type: string) {
      let cur;
      let min;
      let
        max;
      switch (type) {
        case 'zoom':
          if (this.enableMultiSelect) {
            this.enableMultiSelect = false;
          }
          this.enableBrush = !this.enableBrush;
          break;
        case 'select':
          if (!this.enableSelect) {
            return;
          }
          if (this.enableBrush) {
            this.enableBrush = false;
          }
          this.enableMultiSelect = !this.enableMultiSelect;
          break;
        case 'zoomOut':
          [cur, max] = [this.currentScale, this.zoomSettings.scaleMax];
          this.currentScale = cur + 1 > max ? max : cur + 1;
          this.zoomed(this.currentScale);
          break;
        case 'zoomIn':
          [cur, min] = [this.currentScale, this.zoomSettings.scaleMin];
          this.currentScale = cur - 1 < min ? min : cur - 1;
          this.zoomed(this.currentScale);
          break;
        case 'fit':
          min = this.zoomSettings.scaleMin;
          this.zoomed(Math.max(min, 1.65));
          break;
        case 'move':
        default:
          this.enableBrush = false;
          break;
      }
    }

    private getSource(bundle: any) {
      return bundle.values().next().value.source;
    }

    private getTarget(bundle: any) {
      return bundle.values().next().value.target;
    }

    private updateTags(newTags: any) {
      const _ = this;
      this.tags = newTags;
      if (this.tags.length === 0) {
        this.networks.map((n: Network) => {
          n.filtered = true;
        });
        selectAll('.device, .edge').classed('invisible', false);
      } else {
        this.networks.map((n: Network) => {
          let isMatched = false;
          _.tags.map((t: { text: string }) => {
            if (t.text === n.text) {
              isMatched = true;
            }
          });
          n.filtered = isMatched;
        });
      }
      // update the scale to force to refresh cluster
      _.refreshViaScale();
    }

    private showPopover(x: any, y: any) {
      this.popoverX = x;
      this.popoverY = y;
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  ptpLinkColor = #99cc00
  syncLinkColor_active = #00ffcc
  syncLinkColor_inactive = #00cc66
  physicalLinkColor = #4d4d4d
  vlanLinkColor = #5da5da
  vlanColor = #90d8ff
  rtLinkColor = #e9ce7d
  lspLinkColor = #90d8ff
  lspColor = #ffafe3
  teTunnelColor = #f17cb0
  teLinkColor = #5da5da
  pwColor = #b2912f
  l2vpnColor = #9c27b0
  l3vpnColor = #cf5ae3
  >>> path
    &.arrow-PHYSICAL
      fill physicalLinkColor

    &.arrow-SYNC_LINK
      fill syncLinkColor_active

    &.arrow-PTP_LINK
      fill ptpLinkColor

    &.arrow-TE_TUNNEL
      fill teTunnelColor

    &.arrow-RT_LINK
      fill rtLinkColor

    &.arrow-TE_LINK
      fill teLinkColor

    &[layer=PHYSICAL]
      stroke physicalLinkColor

    &[layer=SYNC_LINK]
      stroke syncLinkColor_active

    &[layer=PTP_LINK]
      stroke ptpLinkColor

    &[layer=PW]
      stroke pwColor

    &[layer=RT_LINK]
      stroke rtLinkColor

    &[layer=TE_TUNNEL]
      stroke teTunnelColor

    &[layer=TE_LINK]
      stroke teLinkColor

    &[layer=VLAN_LINK]
      stroke vlanLinkColor

    &[layer=VLAN]
      stroke vlanColor

    &[layer=LSP_LINK]
      stroke lspLinkColor

    &[layer=LSP]
      stroke lspColor

  svg.brush-enable
    cursor crosshair

  >>> .ti-tag, >>> .ti-selected-item
    background-color #07c

  .float-panel
    position fixed
    left 10px
    top 25%

    ul
      list-style none
      padding 0

      label
        display none
        background-color rgba(0, 0, 0, .6)
        padding 5px 10px
        color #fff
        position relative
        margin-left 10px

        &:before
          position absolute
          left -6px
          top 50%
          margin-top -6px
          content ''
          display block
          border-top 6px solid transparent
          border-bottom 6px solid transparent
          border-right 6px solid rgba(0, 0, 0, .6)

      li:hover
        i
          opacity 1

        label
          display inline-block

      li.on
        i
          opacity 1
          color #fff
          background-color #07c

      li.disabled
        cursor not-allowed

        i
          opacity 1
          color #666
          background #aaa

    i
      padding 5px 8px
      line-height 20px
      background-color lightgray
      opacity .7
      color gray

    li + li
      margin-top 10px

    li + li.no-top
      margin-top 0px

  .low-opacity
    opacity .05

  text, label
    user-select none

  .invisible
    display none !important

  .field
    display inline-block
    margin 5px

    input
      line-height 18px
      display none

    label
      position relative
      padding 3px 5px 3px 5px
      cursor pointer
      border-radius 5px
      border 1px solid lightgray

    input:checked + label
      background-color #07c
      color #fff

    i
      margin-left 5px

    &.tag, &.clear-all
      position relative

      label
        padding-right 24px
        background-color #07c
        color #fff

      i
        cursor pointer
        position absolute
        color #fff
        right 8px
        top 50%
        margin-top -8px

    &.clear-all
      color #fff

      label
        background-color #9c27b0

</style>
