<template lang="pug">
    g.network
        BaseNodeItem(
            text-anchor="middle"
            type="cluster"
            v-if="network.properties"
            :r="r / 1.3"
            :circle-fill="network.fill"
            :stroke-width="strokeWidth"
            :font-size="fontSize"
            :text="network.text || network.properties.point_count"
            :transform="`translate(${network.cx},${network.cy})`")
        BaseHullConvex(
            type="pie"
            :id="network.id"
            :points="network.points"
            :text="network.text"
            :data="network.event"
            :r="r / 1.5"
            :font-size="fontSize / 1.5"
            :stroke-width="strokeWidth"
            :click-callback="clickCallback"
            :close-callback="closeCallback"
            :nodes-visible="nodeVisible"
            :expanded="network.expanded"
            :selected="network.multiSelected")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseHullConvex from '@/components/basic/BaseHullConvex.vue';
import BaseNodeItem from '@/components/basic/BaseNodeItem.vue';

    @Component({
      components: {
        BaseHullConvex,
        BaseNodeItem,
      },
    })
export default class NetworkNode extends Vue {
        @Prop() network!: any;

        @Prop() clickCallback!: any;

        @Prop() closeCallback!: any;

        @Prop() r!: number;

        @Prop() fontSize!: number;

        @Prop() strokeWidth!: number;

        @Prop() nodeVisible!: boolean;

        @Prop() id!: any;
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
</style>
