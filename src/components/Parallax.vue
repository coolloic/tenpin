<template lang="pug">
  v-parallax.parallax-panel(:height="height" :src="img")
    h1.booking-title.white--text We are open in alert level 2
    h2.booking-subtitle.white--text
      strong Please book a lane
      = 'to heal us manage our maximum 100 capacity.'
    .pl-0.pr-0.booking-content.mt-4: h3.text--primary Welcome to PINS. Come along for a great bowling experience then relax and share a laugh with family and friends. We’re open 7 days a week, from 9.30am to Midnight! PINS is the perfect place for group functions, kids birthdays and a whole lot more. See below for some of the great options and facilities that we offer. PINS – where we play!
    v-btn.mt-4.booking-btn(tile color="white" outlined large @click="click")
      v-icon.white--text(left) assignment_turned_in
      = 'Make a booking'
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Parallax',
    props: ['height', 'img'],
    data: () => ({}),
    methods: {
      click() {
        this.$emit('click', {});
      }
    }
  });
</script>
<style lang="stylus">
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

  .parallax-panel
    text-align center

</style>
