<template lang="pug">
  g.device(
    @click="clickDevice(id)"
    :class="classes"
    :id="id"
    :transform="`translate(${this.cx},${this.cy})`")
    circle.out-circle(
      :r="2 * r"
      :stroke-width="strokeWidth")
    BaseNodeItem(
      v-if="type ==='node'"
      :r="r" :circleFill="fill"
      :stroke-width="strokeWidth"
      :font-size="fontSize"
      :text="text")
    BaseEventPie(
      v-if="type ==='pie'"
      :r="r"
      :stroke-width="strokeWidth"
      :data="data"
      :font-size="fontSize"
      :text="text"
      :mouseover-callback="mouseOverEvent"
      :mouseout-callback="()=> mouseOutEvent(600)")
    g.timer(
      v-if="true"
      :transform="translateToRightBottom")
      path(d="M16 0 A16 16 0 0 0 0 16 A16 16 0 0 0 16 32 A16 16 0 0 0 32 16 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 28 16 A12 12 0 0 1 16 28 A12 12 0 0 1 4 16 A12 12 0 0 1 16 4 M14 6 L14 17.25 L22 22 L24.25 18.5 L18 14.75 L18 6z ")
    g.gear(
      v-if="true"
      :transform="translateToLeftBottom")
      path(d="M14 0 H18 L19 6 L20.707 6.707 L26 3.293 L28.707 6 L25.293 11.293 L26 13 L32 14 V18 L26 19 L25.293 20.707 L28.707 26 L26 28.707 L20.707 25.293 L19 26 L18 32 L14 32 L13 26 L11.293 25.293 L6 28.707 L3.293 26 L6.707 20.707 L6 19 L0 18 L0 14 L6 13 L6.707 11.293 L3.293 6 L6 3.293 L11.293 6.707 L13 6 L14 0 z M16 10 A6 6 0 0 0 16 22 A6 6 0 0 0 16 10")
    foreignObject(
      v-if="showPopover"
      width="250"
      height="220"
      :transform="translateToNode")
      BaseNodePopover(
        :data="data"
        :stroke-width="strokeWidth"
        :mouseout-callback.prevent="mouseOutEvent"
        :mouseover-callback="mouseOverEvent"
        :showPopover="showPopover" )
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {select, drag, event} from 'd3';
  import BaseEventPie from '@/components/basic/BaseEventPie.vue';
  import BaseNodeItem from '@/components/basic/BaseNodeItem.vue';
  import BaseNodePopover from '@/components/basic/BaseNodePopover.vue';

  @Component({
    components: {
      BaseEventPie,
      BaseNodeItem,
      BaseNodePopover,
    },
  })
  export default class DeviceNode extends Vue {
    showPopover: boolean = false;
    active: boolean = false;
    fn: any;
    @Prop() private type!: string;
    @Prop() private id!: any;
    @Prop() private cx!: number;
    @Prop() private cy!: number;
    @Prop() private r!: number;
    @Prop() private text!: string;
    @Prop() private fontSize!: number;
    @Prop() private strokeWidth!: number;
    @Prop() private stroke!: string;
    @Prop() private fill!: string;
    @Prop() private textFill!: string;
    @Prop() private clickCallback!: (id: string) => {};
    @Prop() private data!: any;
    @Prop() private clazz!: string;
    @Prop() private dragCallback!: any;

    get translateToRightBottom() {
      return `translate(${this.r / 2},${this.r / 2}) scale(${this.strokeWidth / 5})`;
    }

    get translateToLeftBottom() {
      return `translate(${this.r / 1.1},${-this.r / 4}) scale(${this.strokeWidth / 5})`;
    }

    get translateTobottom() {
      return `translate(${this.r / 1.1},${-this.r / 4}) scale(${this.strokeWidth / 5})`;
    }

    get translateToNode() {
      return `translate(${-this.r * 5.5},${this.r}) scale(${this.strokeWidth / 2})`;
    }

    get classes() {
      const active = this.active ? 'active' : '';
      return `${this.clazz} ${active}`;
    }

    clickDevice(id: string) {
      if (this.clickCallback) {
        this.clickCallback(id);
      }
    }

    mounted() {
      if (isNaN(this.id) && this.dragCallback) {
        const _ = this;

        drag().on('drag', () => {
          _.dragCallback(_.id, event.dx, event.dy);
        })(select(`#${this.id}`));
      }
    }

    mouseOverEvent() {
      if (this.fn) {
        clearTimeout(this.fn);
      }
      const _ = this;
      this.fn = setTimeout(() => {
        _.showPopover = true;
      }, 600);
    }

    mouseOutEvent(delay: number = 0) {
      const _ = this;
      if (this.fn) {
        clearTimeout(this.fn);
      }
      this.fn = setTimeout(() => {
        this.showPopover = false;
      }, delay);
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .out-circle
    display none
    fill none
    stroke #70C

  g.device.active
    .out-circle
      display inline-block

  .timer
    fill #70c

  .gear
    fill #07c
</style>
