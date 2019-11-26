<template lang="pug">
    defs
        marker(
            v-for="a in arrowHeaders"
            :id="a.id"
            :refX="arrow.refX"
            :refY="arrow.refY"
            :markerWidth="arrow.markerWidth"
            :markerHeight="arrow.markerHeight"
            :markerUnits="a.markerUnits"
            :orient="a.orient")
            path(
                :d="arrow.d"
                :class="a.id")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Layer } from '@/components/pojo/Enums';

    @Component
export default class ArrowHeader extends Vue {
        @Prop() r!: number;

        @Prop() currentScale!: number;

        arrowHeaders: any = (function () {
          const physical = {
            id: `arrow-${Layer.PHYSICAL}`,
            markerUnits: 'userSpaceOnUse',
            orient: 'auto',
          };
          const sycLink = { ...physical, id: `arrow-${Layer.SYNC_LINK}` };
          const ptpLink = { ...physical, id: `arrow-${Layer.PTP_LINK}` };
          const rtLink = { ...physical, id: `arrow-${Layer.RT_LINK}` };
          const teTunnel = { ...physical, id: `arrow-${Layer.TE_TUNNEL}` };
          const teLink = { ...physical, id: `arrow-${Layer.TE_LINK}` };
          return [physical, sycLink, ptpLink, rtLink, teTunnel, teLink];
        }());

        get arrow() {
          const s = this.scale;
          return {
            refX: this.r * 1.5,
            refY: 0.5 / s,
            markerWidth: 30 / s,
            markerHeight: 30 / s,
            d: this.arrowPath,
            xoverflow: 'visible',
            viewBox: this.arrowViewBox,
          };
        }

        get arrowViewBox() {
          const s = this.scale;
          return `${1 / s},${0.5 / s},${1 / s},${1 / s}`;
        }

        get scale() {
          return this.currentScale / 10;
        }

        get arrowPath() {
          const s = this.scale;
          return `M 0 0 ${1 / s} ${0.5 / s} 0 ${1 / s} ${0.25 / s} ${0.5 / s}`;
        }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    rect
        fill none
        stroke lightgray
        stroke-width .5
</style>
