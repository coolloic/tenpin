<template lang="pug">
  g.grid: rect(
    v-for="cell in cells"
    :x="cell.x"
    :y="cell.y"
    :width="cell.width"
    :height="cell.height")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class GridAssist extends Vue {
    @Prop() private width!: number;

    @Prop() private height!: number;

    @Prop() private clusterRange!: number;

    get cells() {
      const {width} = this;
      const {height} = this;
      const {clusterRange} = this;
      const cells: any = {};
      for (let x = 0; x <= width; x += clusterRange) {
        for (let y = 0; y <= height; y += clusterRange) {
          cells[`r${x / clusterRange}c${y / clusterRange}`] = {
            x,
            y,
            width: clusterRange,
            height: clusterRange,
            ids: new Set(),
            index: `r${x / clusterRange}c${y / clusterRange}`,
            color: '#999',
          };
        }
      }
      return cells;
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  rect
    fill none
    stroke lightgray
    stroke-width .5
</style>
