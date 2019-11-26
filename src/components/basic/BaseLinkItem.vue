<template lang="pug">
    g.edge(
        @mouseover="mouseoverEvent"
        @mouseout="mouseoutEvent")
        path(
            :class="edge.class"
            :d="edge.d"
            :marker-end="edge.arrow"
            :stroke-width="edge.highlight ? 2 * strokeWidth * 1.5 : strokeWidth / 2"
            :x1="edge.x1"
            :x2="edge.x2"
            :y1="edge.y1"
            :y2="edge.y2"
            :sid="edge.source.id"
            :tid="edge.target.id"
            :arc="edge.arc"
            :id="edge.id"
            :layer="edge.layer")
        text.fa(
            v-if="hideText"
            :font-size="fontSize"
            :sid="edge.source.id"
            :tid="edge.target.id")
                textPath(
                    :xlink:href="'#'+edge.id"
                    startOffset="50%"
                    text-anchor="middle") {{edge.id}}
                    tspan(
                        v-for='i in edge.icons'
                        :fill="i.fill"
                        v-html="i.icon")
        g.gear(
            v-if="false"
            :transform="translate")
            path(
                d="M14 0 H18 L19 6 L20.707 6.707 L26 3.293 L28.707 6 L25.293 11.293 L26 13 L32 14 V18 L26 19 L25.293 20.707 L28.707 26 L26 28.707 L20.707 25.293 L19 26 L18 32 L14 32 L13 26 L11.293 25.293 L6 28.707 L3.293 26 L6.707 20.707 L6 19 L0 18 L0 14 L6 13 L6.707 11.293 L3.293 6 L6 3.293 L11.293 6.707 L13 6 L14 0 z M16 10 A6 6 0 0 0 16 22 A6 6 0 0 0 16 10")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
export default class Link extends Vue {
        @Prop() edge!: any;

        @Prop() mouseoverCallback!: any;

        @Prop() mouseoutCallback!: any;

        @Prop() fontSize!: number;

        @Prop() edgeVisible!: number;

        @Prop() strokeWidth!: number;

        hideText: boolean = true;

        mouseoverEvent() {
          if (this.mouseoutCallback) { this.mouseoutCallback(this.edge); }
        }

        mouseoutEvent() {
          if (this.mouseoutCallback) { this.mouseoutCallback(this.edge, false); }
        }

        get translate() {
          const e = this.edge;
          const [x1, y1, x2, y2] = [e.x1, e.y1, e.x2, e.y2];
          const x = (x1 + x2) / 2;
          const y = (y1 + y2) / 2;
          return `translate(${x},${y}) scale(${this.strokeWidth / 4})`;
        }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    .edge
        path
            fill none
            stroke #000

</style>
