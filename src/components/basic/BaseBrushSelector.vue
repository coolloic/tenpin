<template lang="pug">
    g.brush(
        shape-rendering="crispEdges"
        fill-opacity=".125"
        :stroke-width="strokeWidth")
        path.temphull(
            :stroke-width="strokeWidth")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
export default class BrushSelector extends Vue {
        @Prop() private strokeWidth!: number;

        @Prop() private r!: number;
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    .multiselect >>> rect.selection
        stroke #ffc200
        fill #ffc200
        fill-opacity .2

    .zoomselect >>> rect.selection
        stroke #70c
        fill #70c
        fill-opacity .05

    .temphull
        opacity .2
        fill #07c
        stroke-linejoin round
</style>
