<template lang="pug">
  v-parallax.parallax-panel(:height="height" :src="img")
    h1.booking-title.white--text What do we have
    .mt-6.max-500
      v-chip.ma-2(v-for="(item,i) in images")
        v-avatar.play-icon
          v-img( width=50 :src="item.src" :key="i")
        label.bold.ml-1 {{item.title}}
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Scope',
    props: ['height', 'img'],
    data: () => ({
      images: [{
        title: 'Tenpin Bowling',
        src: require('../assets/bowling.svg')
      }, {
        title: 'Gaming Lounge',
        src: require('../assets/lounge.svg')
      }, {
        title: 'Pool Table',
        src: require('../assets/pool_ball.svg')
      }, {
        title: 'Arcade Games',
        src: require('../assets/gaming.svg')
      }, {
        title: 'Birthday Party',
        src: require('../assets/party.svg')
      }, {
        title: 'Business',
        src: require('../assets/business.svg')
      }, {
        title: 'Fully Licensed',
        src: require('../assets/licensed.svg')
      }, {
        title:'Food & Drink',
        src: require('../assets/food.svg')
      }]
    }),
    methods: {
      click() {
        this.$emit('click', {});
      }
    }
  });
</script>
<style lang="stylus">
  .max-500
    max-width 800px
    margin 0 auto
    .v-chip
      width 143px
      max-width calc(50% - 18px)
  .booking
    &-title
      font-size 2.5rem
      line-height 1.1
      word-break normal
      text-transform uppercase
      text-shadow 1px 1px 1px #000
      @media (max-width 768px)
        font-size 1.6rem

    &-btn
      margin 0 auto
      width min-content

    &-subtitle
      font-size 1.8rem
      line-height 1
      margin 0 auto
      margin-top 8px
      text-shadow 1px 1px 1px #000
      @media (min-width 992px)
        max-width 60%
      @media (max-width 768px)
        font-size 1.2rem

      strong
        display block

    &-content
      font-size 1rem
      @media (min-width 992px)
        max-width 60%
        margin 0 auto
      @media (max-width 768px)
        font-size .7rem
  .play-icon
    border-radius 0!important
  .parallax-panel
    text-align center

</style>
