<template lang="pug">
  g(
    @mouseover="onMouseHoverEvent"
    @mouseout="onMouseOutEvent"
    @click="onClickEvent")
    circle(
      :r="radius"
      :stroke="circleStroke || '#81cdf2'"
      stroke-opacity="0.5" :fill="circleFill || '#039be5'"
      :stroke-width="strokeW")
    text(
      :font-size="fontSize || 10"
      :text="text || ''"
      :fill="textFill || '#000'"
      text-anchor="middle"
      :transform="t") {{text}}
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class Node extends Vue {
    @Prop() private id!: string;

    @Prop() private cx!: number;

    @Prop() private cy!: number;

    @Prop() private r!: number;

    @Prop() private text!: string;

    @Prop() private fontSize!: number;

    @Prop() private strokeWidth!: number;

    @Prop() private circleStroke!: string;

    @Prop() private circleFill!: string;

    @Prop() private textFill!: string;

    @Prop() private mouseoverCallback!: any;

    @Prop() private mouseoutCallback!: any;

    @Prop() private clickCallback!: any;

    @Prop() private textAnchor!: string;

    @Prop() private type!: 'cluster' | 'node';

    get t() {
      return this.textAnchor === 'middle' ? `translate(0,${this.r / 5})` : `translate(0,${-this.r * 1.1})`;
    }

    get radius() {
      return this.type === 'cluster' ? (this.r / 1.2 || 10) : (this.r || 10);
    }

    get strokeW() {
      return this.type === 'cluster' ? (this.r / 1.6 || 1) : (this.strokeWidth || 10);
    }

    onMouseHoverEvent() {
      if (this.mouseoverCallback) {
        this.mouseoverCallback(this.id);
      }
    }

    onMouseOutEvent() {
      if (this.mouseoutCallback) {
        this.mouseoutCallback(this.id);
      }
    }

    onClickEvent() {
      if (this.clickCallback) {
        this.clickCallback(this.id);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
</style>
