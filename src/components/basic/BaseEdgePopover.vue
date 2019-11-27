<template lang="pug">
  .popover
    i.fas.fa-plus-square(
      v-if="!unbundled"
      title="Unbundle Edges"
      @click="()=>unbundleCallback(true)")
    i.fas.fa-minus-square(
      v-if="unbundled"
      title="Bundle Edges"
      @click="()=>unbundleCallback(false)")
    i.fas.fa-times(
      v-if="false"
      @click="closeCallback"
      title="Close")
    .arrow(:class="unbundled ? 'down' : 'up'")
    ul.popover-title(v-if="source &&  target")
      li: label Source
      li: label Target
      li: label Layer
    hr
    .popover-content(v-if="data.length > 0")
      ul.list-group
        li(v-for="d in data")
          label {{d.source.text}}
          label {{d.target.text}}
          label {{d.layer}}
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import Device from '@/components/pojo/Device';

  @Component
  export default class EdgePopover extends Vue {
    @Prop() source!: Device;

    @Prop() target!: Device;

    @Prop() data!: any;

    @Prop() closeCallback: any;

    @Prop() unbundleCallback: any;

    @Prop() unbundled!: boolean;
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .popover
    position absolute
    text-align center
    border 1px solid rgba(0, 0, 0, 0.2)
    margin-top 15px
    padding 20px 15px 15px 15px
    background #fff
    width 215px

    i
      cursor pointer

    i.fa-plus-square, i.fa-minus-square
      position absolute
      top 5px
      right 10px

    i.fa-times
      position absolute
      top 5px
      right 25px

    h3
      font-size 12px

    .popover-title
      display flex
      list-style none
      margin 0
      padding 0
      flex-basis 0
      text-align left

      li
        flex-grow 1

        label
          padding 3px 5px
          border-radius 5px

    .arrow.down
      position absolute
      bottom -10px
      left 50%
      margin-left -5px
      width 0
      height 0
      border-left 10px solid transparent
      border-right 10px solid transparent
      border-top 10px solid #999

      &:after
        position absolute
        content " "
        left -10px
        bottom 1px
        border-left 10px solid transparent
        border-right 10px solid transparent
        border-top 10px solid #999
        border-top-color #fff

    .arrow.up
      position absolute
      top -10px
      left 50%
      margin-left -5px
      width 0
      height 0
      border-left 10px solid transparent
      border-right 10px solid transparent
      border-bottom 10px solid #999

      &:after
        position absolute
        content " "
        left -10px
        top 1px
        border-left 10px solid transparent
        border-right 10px solid transparent
        border-bottom 10px solid #999
        border-bottom-color #fff

    .list-group
      list-style none
      padding 0
      margin 0
      max-height 120px
      overflow-y auto

      li
        text-align left
        display flex
        font-size 10px
        background-color #07C
        color #fff
        padding 5px 10px
        border-bottom 1px solid rgba(255, 255, 255, .6)

        label
          flex-basis 0
          flex-grow 1
          position relative
          padding-right 20px

          &:last-child
            padding-right 0

        label + label:before
          content ' '
          position absolute
          left -20px
          height 12px
          width 1px
          display inline-block
          background-color #fff
          opacity .6

</style>
