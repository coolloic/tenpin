<template lang="pug">
  v-card
    v-img.white--text.align-end.flex(:src="img")
      v-card-title.box-shadow(v-if="title" :class="className") {{title}}
        v-spacer
    v-btn.primary.white--text.tile-badge(large v-html="tag" rounded absolute right @click="click")
    v-card-subtitle.pb-0(v-if="false") {{subtitle}}
    v-card-text.pb-0.text--primary(v-if="content")
      v-list(:class="tableCls ? tableCls : ''")
        v-list-item.pa-2.table-item(v-for="(item,i) in content" :key="i")
          v-list-item-content.price-field.pt-0.pb-0(v-html="item.field")
          v-list-item-content.align-end.pt-0.pb-0.orange--text.price-label {{item.price}}
    v-card-actions
      v-spacer
      v-btn.primary.booking-btn(text color="white" outlined @click="click" x-large :class="!hideBtn ? '' : 'invisible'") Booking
        v-icon.ml-1 assignment_turned_in
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Tile',
    props: ['img', 'title', 'subtitle', 'content', 'tag', 'className', 'tableCls', 'hideBtn'],
    data: () => ({}),
    methods: {
      click() {
        this.$emit('click', {})
      }
    }
  });
</script>
<style lang="stylus">
  .v-btn.tile-badge
      margin-top -22px
      text-shadow 1px 1px 1px #000
      strong
        display inline-block
        border-radius 50%
        background #fff
        color #000
        width 28px
        height 28px
        font-size 16px
        margin-right 3px
        margin-left -12px
        line-height 28px
        text-shadow 0 -0.05em 0.2em #FFF, 0.01em -0.02em 0.15em #FE0, 0.01em -0.05em 0.15em #FC0, 0.02em -0.15em 0.2em #F90, 0.04em -0.2em 0.3em #F70, 0.05em -0.25em 0.4em #F70, 0.06em -0.2em 0.9em #F50, 0.1em -0.1em 1em #F40

  .text-shadow
    text-shadow 1px 1px 2px #000

  .price-field
    font-weight bold
    flex-grow 4 !important
    line-height 1.9

  .table-item:nth-child(2n)
    background #eee
  .no-stripe .table-item:nth-child(2n)
    background #fff

  .price-label
    font-weight bold
    font-size 120%
  @media (max-width: 768px)
    .booking-btn
      width 100%!important
  .booking-btn.invisible
    visibility hidden
</style>
