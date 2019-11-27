<template lang="pug">
  g.network(
    v-if="this.c"
    :id="id")
    circle.out-circle(
      v-if="selected"
      :cx="c.x"
      :cy="c.y"
      :r=" 2 * r"
      :stroke-width="strokeWidth")
    path.overlay(
      v-if="(expanded && nodesVisible) || showOverlay"
      :class="(expanded && nodesVisible) ? 'expanded' : ''"
      :d="d"
      :stroke-width="(expanded && nodesVisible) ? 40 * strokeWidth: strokeWidth / 2")
    text.fa(
      v-if="expanded && nodesVisible"
      text-anchor="middle"
      :id="'network-'+id"
      :transform="tc"
      :font-size="fontSize * 2") &#xf6ff {{text}}
    image.close-network(
      xlink:href="https://loic-web-app.s3-ap-southeast-2.amazonaws.com/close.svg"
      v-if="expanded && nodesVisible"
      :width="3*r"
      :height="3*r"
      :x="t.x - 1.5 * r"
      :y="t.y - 6*r"
      :font-size="fontSize * 2"
      @click.prevent="onCloseEvent")
    BaseEventPie(
      donuts="true"
      v-if="tp == 'pie' && (!expanded || !nodesVisible)"
      :id="id"
      :transform="tc"
      :data="data"
      :r="r"
      :font-size="fontSize"
      :stroke-width="strokeWidth"
      :text="text"
      :mouseover-callback="mouseOverCallback"
      :mouseout-callback="mouseOutCallback"
      :click-callback="clickNodeCallback"
      :title-visibility="true")
    BaseNodeItem(
      v-if="tp == 'node' && (!expanded || !nodesVisible)"
      :id="id" :transform="tc"
      :data="data"
      :r="r"
      :font-size="fontSize"
      :stroke-width="strokeWidth"
      :text="text"
      :mouseover-callback="mouseOverCallback"
      :mouseout-callback="mouseOutCallback"
      :click-callback="clickNodeCallback")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {drag, select, event, polygonHull, polygonCentroid} from 'd3';
  import BaseEventPie from '@/components/basic/BaseEventPie.vue';
  import BaseNodeItem from '@/components/basic/BaseNodeItem.vue';

  @Component({
    components: {
      BaseEventPie,
      BaseNodeItem,
    },
  })
  export default class Hull extends Vue {
    showOverlay: boolean = false;
    fn: any;
    @Prop() private id!: any;
    @Prop() private points!: any;
    @Prop() private text!: string;
    @Prop() private number!: string;
    @Prop() private r!: number;
    @Prop() private data!: any;
    @Prop() private fontSize!: number;
    @Prop() private strokeWidth!: number;
    @Prop() private type!: 'node' | 'pie';
    @Prop() private dragCallback!: any;
    @Prop() private clickCallback!: any;
    @Prop() private closeCallback!: any;
    @Prop() private nodesVisible!: number;
    @Prop() private expanded!: boolean;
    @Prop() private selected!: boolean;

    mounted() {
      let _ = this;
      if (isNaN(this.id) && this.dragCallback) {
        const _ = this;

        drag().on('drag', () => {
          _.dragCallback(_.id, event.dx, event.dy);
        })(select(`#${this.id}`));
      }
    }

    get tc() {
      return `translate(${this.c!.x},${this.c!.y})`;
    }

    get tp() {
      return this.type == null || this.type === 'node' ? 'node' : 'pie';
    }

    get d() {
      if (!this.points || this.points.length < 1) {
        // console.log('Network is unavailable');
        return;
      }
      const hullPoints = polygonHull(this.points)!;

      return hullPoints ? `M${hullPoints.join('L')}Z` : null;
    }

    get c() {
      if (!this.points || this.points.length < 1) {
        // console.log('Network is unavailable');
        return;
      }
      const hullPoints = polygonHull(this.points);
      let
        centerid;
      if (hullPoints) {
        centerid = polygonCentroid(hullPoints)!;
      }
      if (centerid && isNaN(centerid[0])) {
        centerid = hullPoints![0];
      }
      return centerid ? {x: centerid[0] || 0, y: centerid[1] || 0} : {x: 0, y: 0};
    }

    get t() {
      if (!this.points.length || this.points.length < 1) {
        // console.log('Network is unavailable');
        return;
      }
      const hullPoints = polygonHull(this.points);
      let
        toppoint: any;
      if (hullPoints) {
        toppoint = hullPoints[0];
        hullPoints.map((p: any) => {
          toppoint = toppoint[1] > p[1] ? p : toppoint;
        });
      }
      return toppoint ? {x: toppoint[0] || 0, y: toppoint[1] || 0} : {x: 0, y: 0};
    }

    mouseOverCallback(id: string) {
      const _ = this;
      this.fn = setTimeout(() => {
        this.showOverlay = true;
      }, 600);
    }

    mouseOutCallback(id: string) {
      if (this.fn) {
        clearTimeout(this.fn);
      }
      this.showOverlay = false;
    }


    onCloseEvent() {
      this.showOverlay = false;
      if (this.closeCallback) {
        this.closeCallback(this.id);
      }
    }

    clickNodeCallback(id: string) {
      if (this.clickCallback) {
        this.clickCallback(this.id);
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  path.overlay
    cursor move

  .close-network
    cursor pointer

  .overlay
    fill #07c
    opacity 1
    stroke #07c
    fill-opacity .2
    display inline-block
    stroke-linejoin round

    &.opacity
      stroke-opacity 0.2

    &.expanded
      fill-opacity 1
      stroke-opacity 1
      opacity .2

  .out-circle
    stroke #07C
    fill none
    cursor grab
</style>
