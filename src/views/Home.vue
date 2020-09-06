<template lang="pug">
  mixin nav-drawer
    v-navigation-drawer(v-model="drawer" fixed left temporary)
      .light-blue.pt-2.pb-2
        v-img.ml-4.mr-4(src="https://pins.co.nz/wp-content/uploads/2015/06/pins-logo.png" max-width="100")
      v-divider
      v-list(nav)
        v-list-item-group(active-class="blue--text text--accent-4")
          v-list-item.border-bt.ma-0(v-for="(item,index) in items" :key="index" @click="click(item)")
            v-list-item-icon.ma-3(v-if="item.icon"): v-icon {{item.icon}}
            v-list-item-title(v-if="item.name") {{item.name}}

  mixin booking-dialog
    v-dialog#contact(v-model="dialog" max-width="600px")
      v-card
        v-card-title.headline.grey.lighten-3 Make a Booking
        v-card-text.pa-2: booking

  mixin app-bar
    v-app-bar.sticky-app-bar.app-bar(dark outlined fixed)
      v-img.logo(src="https://pins.co.nz/wp-content/uploads/2015/06/pins-logo.png" max-width="60px")
      v-app-bar-nav-icon(@click.stop="drawer = !drawer")
      v-spacer
      v-tooltip(v-model="bookingIcon" bottom )
        template(v-slot:activator="{on, attrs}")
          v-btn(icon v-bind="attrs" v-on="on" @click="dialog = !dialog"): v-icon assignment_turned_in
        span Make a booking
      v-tooltip(v-model="newsIcon" bottom)
        template(v-slot:activator="{on, attrs}")
          v-btn(icon v-bind="attrs" v-on="on"): v-icon fiber_new
        span What's on
      v-tooltip(v-model="searchIcon" bottom)
        template(v-slot:activator="{on, attrs}")
          v-btn(icon v-bind="attrs" v-on="on"): v-icon mdi-magnify
        span Search

  mixin price-tiles
    v-container
      v-row(cols="12" md="8" sm="12")
        v-col(lg="3" md="4" sm="6" v-for="item in pricesData")
          tile(v-bind="item" @click="dialog = !dialog")

  mixin parallax-banner
    v-container
      v-row(cols="12"): v-col(cols="12")
        parallax(height="400" img="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" @click="dialog = !dialog")

  mixin booking-button
    v-btn(
      fixed
      dark
      fab
      bottom
      right
      color="pink"
      @click="dialog = !dialog")
      v-icon assignment_turned_in

  mixin system-bar
    v-system-bar.sticky-system-bar.blue.lighten-1(fixed)
      .flex.width-1440
        v-spacer
        v-chip.pa-2.white--text.transparent(small link)
          v-icon.white--text.map-icon map
          label 14 Link Crescent, Stanmore Bay
        v-chip.pa-2.ml-2.blue.lighten-5.blue--text(href="tel: 0800 666 666" small)
          v-icon.blue--text phone
          label 0800 666 666
  v-app#inspire
    +system-bar
    +app-bar
    +nav-drawer
    +booking-dialog
    v-content.mt-84
      carousel
      .width-1440
        +parallax-banner
        event-tile(@click="dialog = !dialog")
        +price-tiles
    +booking-button
    t-footer

</template>

<script>
  import Carousel from '@/components/Carousel';
  import TFooter from '@/components/TFooter';
  import Tile from '@/components/Tile';
  import Booking from '@/components/Booking';
  import EventTile from '@/components/EventTile';
  import Parallax from '@/components/Parallax';

  export default {
    name: 'home',
    components: {
      Carousel,
      TFooter,
      Tile,
      Booking,
      Parallax,
      EventTile
    },
    data: () => {
      return {
        pricesData: [{
          img: 'https://img.pixers.pics/pho_wat(s3:700/FO/43/69/31/57/700_FO43693157_1cb14d96c24a9d9b4702ebf563b9ca3b.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/posters-bowling-strike-bunt.jpg.jpg',
          title: 'Individual rates',
          tag: '<strong>1</strong>Game',
          subtitle: 'Number 10',
          content: [{
            field: 'Adults',
            price: '$13.50'
          },{
            field: 'Students/Seniors (over 60 years)',
            price: '$12.50'
          },{
            field: 'Children (under 15 years)',
            price: '$11.50'
          },{
            field: 'Frequent Bowlers Club Member',
            price: '$10.00'
          },{
            field: 'Special Needs',
            price: '$7.50'
          },{
            field: 'League Member',
            price: '$5'
          }],
          href: '#'
        }, {
          img: 'https://freedesignfile.com/upload/2018/08/Bowling-tournament-poster-design-vector-06.jpg',
          title: 'Individual rates',
          tag: '<strong>2</strong>Games',
          subtitle: 'Number 10',
          content: [{
            field: 'Adults',
            price: '$13.50'
          },{
            field: 'Students/Seniors (over 60 years)',
            price: '$12.50'
          },{
            field: 'Children (under 15 years)',
            price: '$11.50'
          },{
            field: 'Frequent Bowlers Club Member',
            price: '$10.00'
          },{
            field: 'Special Needs',
            price: '$7.50'
          },{
            field: 'League Member',
            price: '$5'
          }],
          href: '#'
        }, {
          img: 'https://img.pixers.pics/pho_wat(s3:700/FO/43/69/31/57/700_FO43693157_1cb14d96c24a9d9b4702ebf563b9ca3b.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/posters-bowling-strike-bunt.jpg.jpg',
          title: 'Individual rates',
          tag: '<strong>3</strong>Games',
          subtitle: 'Number 10',
          content: [{
            field: 'Adults',
            price: '$13.50'
          },{
            field: 'Students/Seniors (over 60 years)',
            price: '$12.50'
          },{
            field: 'Children (under 15 years)',
            price: '$11.50'
          },{
            field: 'Frequent Bowlers Club Member',
            price: '$10.00'
          },{
            field: 'Special Needs',
            price: '$7.50'
          },{
            field: 'League Member',
            price: '$5'
          }],
          href: '#'
        }, {
          img: 'https://freedesignfile.com/upload/2018/08/Bowling-tournament-poster-design-vector-06.jpg',
          title: 'Individual rates',
          tag: '<strong>3</strong>Games',
          subtitle: 'Number 10',
          content: [{
            field: 'Adults',
            price: '$13.50'
          },{
            field: 'Students/Seniors (over 60 years)',
            price: '$12.50'
          },{
            field: 'Children (under 15 years)',
            price: '$11.50'
          },{
            field: 'Frequent Bowlers Club Member',
            price: '$10.00'
          },{
            field: 'Special Needs',
            price: '$7.50'
          },{
            field: 'League Member',
            price: '$5'
          }],
          href: '#'
        }],
        dialog: false,
        bookingIcon: false,
        newsIcon: false,
        searchIcon: false,
        drawer: false,
        group: null,
        items: [{
          icon: 'home',
          name: 'Home',
        }, {
          icon: 'fiber_new',
          name: `What's on`,
        }, {
          icon: 'monetization_on',
          name: 'Prices',
        }, {
          icon: 'people',
          name: 'Parties',
        }, {
          icon: 'cake',
          name: 'Functions',
        }, {
          icon: 'extension',
          name: 'Tournaments',
        }, {
          icon: 'assignment_turned_in',
          name: 'Make a booking',
        }, {
          icon: 'contact_mail',
          name: 'Contact Us',
        }]
      };
    },
    watch: {
      group() {
        this.drawer = false;
      }
    },
    methods: {
      click: function (item) {
        switch (item.icon) {
          case 'assignment_turned_in':
          default:
            this.dialog = !this.dialog;
        }
      }
    }
  };
</script>
<style lang="stylus">
  .mt-84
    margin-top 84px
  .app-bar
    top 20px
    width 100%
  .sticky-system-bar
    min-height 32px!important
    z-index 99
    top 0
    label
      line-height 32px
  .sticky-app-bar
    z-index 99
    top 32px!important
  .width-1440
    max-width 1440px!important
    margin auto
  .border-bt
    border-bottom 1px solid #eee
  @media (max-width: 768px)
    .logo
      display none!important
    .v-dialog
      margin 8px!important
  @media (max-width: 320px)
    .map-icon
      display none!important
</style>
