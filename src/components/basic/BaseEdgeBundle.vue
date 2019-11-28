<template lang="pug">
  g.edge-bundler
    line(
      stroke="#07C"
      stroke-opacity="1"
      v-if="valid && !unbundled"
      :x1="source.cx"
      :y1="source.cy"
      :x2="target.cx"
      :y2="target.cy"
      :stroke-width="strokeWidth")
    g.link-circle(
      v-show="valid"
      :transform="translateLinkCircle"
      @click="unbundled = !unbundled"
      @mouseover="clickEvent"
      @mouseout="()=>closePopover(600)")
      circle(
        :r="r / 1.5"
        fill="#07C")
      text(
        text-anchor="middle"
        stroke="#fff"
        fill="#fff"
        stroke-width="0"
        :transform="translateToCenterOfLinkCircle"
        :font-size="fontSize * 1.5" ) {{circleLinkText}}
      text.fa(
        :transform="translateToLinkCircleCorner"
        stroke-width="0"
        :font-size="fontSize"
        v-html="icon")
    BaseLinkItem(
      v-if="unbundled && expanded && isLayerVisible[edge.layer] && valid && edge.filtered"
      v-for="edge in bundle"
      :key="edge.id"
      :edge="edge"
      :stroke-width="strokeWidth"
      :mouseout-callback="supportingLinks"
      :mouseover-callback="supportingLinks"
      :font-size="fontSize")
    foreignObject(
      width="250"
      height="220"
      x="-130"
      v-if="showPopover"
      :y="unbundled ? -230 : 10"
      :transform="translatePopover"
      @mouseover="clickEvent"
      @mouseout="closePopover")
      BaseEdgePopover(
        :source="source"
        :target="target"
        :data="listBundleDetails"
        :closeCallback="closePopover"
        :unbundleCallback="unbundleEdges"
        :unbundled="unbundled")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import BaseLinkItem from '@/components/basic/BaseLinkItem.vue';
  import Device from '@/components/pojo/Device';
  import BaseEdgePopover from '@/components/basic/BaseEdgePopover.vue';
  import Edge from '@/components/pojo/Edge';

  @Component({
    components: {
      BaseEdgePopover,
      BaseLinkItem,
    },
  })
  export default class EdgeBundle extends Vue {
    @Prop() edgeVisible!: boolean;

    @Prop() bundle!: any;

    @Prop() supportingLinks!: any;

    @Prop() fontSize!: number;

    @Prop() strokeWidth!: number;

    @Prop() isLayerVisible!: any;

    @Prop() r!: number;

    @Prop() source!: Device;

    @Prop() target!: Device;

    @Prop() clickCallback!: any;

    showPopover: boolean = false;

    expanded: boolean = false;

    unbundled: boolean = false;

    fn: any;

    get valid() {
      return this.source.visible && this.target.visible && this.source.filtered && this.target.filtered;
    }

    get circleLinkText() {
      return this.bundle.size;
    }

    get translateLinkCircleToCenter() {
      const [x, y] = [this.linkCenter.x, this.linkCenter.y];
      return `translate(${x},${y})`;
    }

    get translateLinkCircle() {
      return this.unbundled ? this.translateToLinkCircleToBoundary : this.translateLinkCircleToCenter;
    }

    get linkCenter() {
      return {
        x: (this.source.cx! + this.target.cx!) / 2,
        y: (this.source.cy! + this.target.cy!) / 2,
      };
    }

    get translateToPopoverToBoundary() {
      return `translate(${this.source.cx! - this.r * 2},${this.source.cy! - this.r * 2}) scale(${this.strokeWidth / 2})`;
    }

    get translateToLinkCircleToBoundary() {
      return `translate(${this.source.cx! - this.r * 3},${this.source.cy! - this.r * 2.2})`;
    }

    get translatePopoverToLinkCircle() {
      const [x, y] = [this.linkCenter.x, this.linkCenter.y];
      return `translate(${x + this.r},${y}) scale(${this.strokeWidth / 2})`;
    }

    get translatePopover() {
      return this.unbundled ? this.translateToPopoverToBoundary : this.translatePopoverToLinkCircle;
    }

    get translateToCenterOfLinkCircle() {
      return `translate(0,${this.r / 4})`;
    }

    get translateToLinkCircleCorner() {
      return `translate(${this.r / 5},${-this.r / 4})`;
    }

    get listBundleDetails() {
      const l: any[] = [];
      Array.from(this.bundle).map((e: Edge) => {
        l.push({
          layer: e.layer,
          source: e.source,
          target: e.target,
        });
      });
      return l;
    }

    get icon() {
      return this.unbundled ? '&#xf146' : '&#xf0fe';
    }

    closePopover(delay: number = 0) {
      const _ = this;
      _.fn = setTimeout(() => {
        this.showPopover = false;
      }, delay);
    }

    unbundleEdges(unbundle: boolean = false) {
      this.unbundled = unbundle;
    }

    clickEvent() {
      if (this.fn) {
        clearTimeout(this.fn);
      }
      this.expanded = true;
      this.showPopover = true;
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .fa
    fill #fefefe
    stroke #07C

  .link-circle
    cursor pointer
</style>
