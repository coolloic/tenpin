<template lang="pug">
    g.pie(
        @mouseover="onMouseHoverEvent"
        @mouseout="onMouseOutEvent"
        @click = "onClickEvent")
        path(
            v-if="p.number != 0"
            v-for="p in path" :fill="p.fill || '#000'"
            :stroke="p.stroke || 1" :d="p.d"
            :stroke-width="sw")
            title(
                v-if="showTitle") {{p.level}} {{p.number}}
        text.fa(
            text-anchor="middle"
            v-if="p.number != 0"
            v-for="p in path"
            :transform="`translate(${p.centerid})`"
            :font-size="fontSize*1.2 || 10") {{p.number}}
            title(
                v-if="showTitle") {{p.level}} {{p.number}}
        text.pie-title(
            text-anchor="middle"
            :font-size="fontSize || 10"
            :fill="textFill || '#000'"
            :transform="`translate(0,${-r*1.4})`") {{text}}
</template>

<script lang="ts">
import * as d3 from 'd3';
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'd3-selection-multi';

    @Component
export default class EventPie extends Vue {
        @Prop() id!: string;

        @Prop() cx!: number;

        @Prop() cy!: number;

        @Prop() r!: number;

        @Prop() strokeWidth!: number;

        @Prop() data!: any;

        @Prop() fontSize!: number;

        @Prop() text!: string;

        @Prop() textFill!: string;

        @Prop() mouseoverCallback!: any;

        @Prop() mouseoutCallback!: any;

        @Prop() clickCallback!: any;

        @Prop() donuts!: boolean;

        @Prop() titleVisibility!: boolean;

        arcGen = (r: any) => d3.arc()
          .innerRadius(this.donuts ? r / 2 : 0)
          .outerRadius(r * 1.2).padAngle(0.05);

        fill = (d: any) => d.fill;

        stroke = (d: any) => d.stroke;

        angleRange = (s: number, e: number, max: number = 100) => {
          const pieScale = d3.scaleLinear().domain([0, max]).range([0, 2 * Math.PI]);
          return { startAngle: pieScale(s), endAngle: pieScale(e) };
        }

        get sw() {
          return this.strokeWidth / 10;
        }

        get showTitle() {
          return !!((this.titleVisibility != null && this.titleVisibility));
        }

        get path() {
          let total: number = 0; let pieScale: any; const _ = this; let
            start: number = 0;
          _.data.map((d: any) => {
            total += d.number;
          });
          _.data.map((d: any) => {
            const arc = _.arcGen(_.r);
            const angles: any = _.angleRange(start, start + d.number, total);

            d.d = arc(angles);
            d.centerid = arc.centroid(angles);
            start += d.number;
          });
          return _.data;
        }

        onMouseHoverEvent() {
          if (this.mouseoverCallback) { this.mouseoverCallback(this.id); }
        }

        onMouseOutEvent() {
          if (this.mouseoutCallback) { this.mouseoutCallback(this.id); }
        }

        onClickEvent() {
          if (this.clickCallback) { this.clickCallback(this.id); }
        }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    .pie
        cursor grab
</style>
