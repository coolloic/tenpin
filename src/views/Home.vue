<template lang="pug">
  mixin nav-drawer
    v-navigation-drawer(v-model="drawer" fixed left temporary)
      .pt-2.pb-2
        v-img.ml-4.mr-4(:src="logo" max-width="100")
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
        v-card-text.pa-2: raw-booking

  mixin app-bar
    v-app-bar.sticky-app-bar.app-bar(outlined fixed)
      .flex.width-1440
        v-img.logo(:src="logo" max-width="60px")
        v-app-bar-nav-icon(@click.stop="drawer = !drawer")
        v-spacer
        label.bold.hidden-sm-and-down Welcome To Whangparaoa Tenpin Bowling
        v-spacer
        label.orange--text.bold(v-if="totalPrice") ${{totalPrice}}.00
        v-tooltip(v-model="bookingIcon" bottom )
          template(v-slot:activator="{on, attrs}")
            v-btn(icon v-bind="attrs" v-on="on" @click="dialog = !dialog"): v-icon assignment_turned_in
          span Make a booking
      //- v-tooltip(v-model="newsIcon" bottom)
        template(v-slot:activator="{on, attrs}")
          v-btn(icon v-bind="attrs" v-on="on"): v-icon fiber_new
        span What's on
      //- v-tooltip(v-model="searchIcon" bottom)
        template(v-slot:activator="{on, attrs}")
          v-btn(icon v-bind="attrs" v-on="on"): v-icon mdi-magnify
        span Search

  mixin price-tiles
    v-container#extension
      v-row(cols="12" md="8" sm="12")
        v-col(lg="4" md="4" sm="6" v-for="item in pricesData")
          tile(v-bind="item" @click="dialog = !dialog")
  mixin price-tiles-2
    v-container#extension
      v-row(cols="12" md="8" sm="12")
        v-col(lg="4" md="4" sm="6" v-for="item in pricesData2")
          tile(v-bind="item" @click="dialog = !dialog")
  mixin parallax-banner
    v-container#fiber_new
      v-row(cols="12"): v-col(cols="12")
        v-card
          parallax(height="400" :img="require('../assets/material2.jpg')" @click="dialog = !dialog")

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
        label.white--text.mr-2.hidden-sm-and-down Monday - Sunday 10:00am - 10:00pm
        v-spacer
        v-chip.pa-2.white--text.transparent(small link)
          v-icon.white--text.map-icon map
          label 14 Link Crescent, Stanmore Bay
        v-chip.pa-2.ml-2.blue.lighten-5.blue--text(href="tel: 0800836746" small)
          v-icon.blue--text phone
          label 0800 tenpin
        v-chip.pa-2.ml-2.blue.lighten-5.blue--text.hidden-sm-and-down(href="tel: 09 428 2469" small)
          v-icon.blue--text phone
          label (09) 428 2469

  mixin calculator
    v-expansion-panels.container#monetization_on: v-expansion-panel
      v-expansion-panel-header.primary.theme--light.price-header
        h3.text--white Price Calculator
      v-expansion-panel-content
        v-divider
        v-form(ref="priceForm")
          v-row(cols="12")
            v-col(lg="3" md="6" sm="12" v-for="(item,i) in priceTiles" :key="i")
              cart(v-bind="item" @update="update" :id="i")
          v-divider
          v-row(cols="12")
            v-col(cols=12)
              v-btn.secondary.cart-reset-btn(@click="resetCalc") reset
              v-btn.primary.cart-booking-btn(@click="dialog = !dialog") Booking
                v-icon assignment_turned_in
              h3.float-right.cart-total-price(v-html="computedTotalPrice")

  mixin scope-tile
    v-container#fiber_new
      v-row(cols="12"): v-col(cols="12"): v-card
        scope(height="400" :img="require('../assets/material2.jpg')")
  v-app#inspire
    +system-bar
    +app-bar
    +nav-drawer
    +booking-dialog
    v-content.mt-84
      carousel#home
      .width-1440
        +scope-tile
        +price-tiles
        +calculator
        event-tile#cake(@click="dialog = !dialog")
        +price-tiles-2
        .container#contact_mail
          v-card.contact-panel
            iframe(src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3201.600805320218!2d174.74309901513973!3d-36.63599447998267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d2511a9c5ae55%3A0x86a37195ea8c8a1a!2sTenpin%20Bowling!5e0!3m2!1sen!2snz!4v1601077648329!5m2!1sen!2snz" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0")
    +booking-button
</template>

<script>
  import Carousel from '@/components/Carousel';
  import TFooter from '@/components/TFooter';
  import Tile from '@/components/Tile';
  import Booking from '@/components/Booking';
  import EventTile from '@/components/EventTile';
  import Parallax from '@/components/Parallax';
  import Cart from '@/components/Cart';
  import RawBooking from '@/components/RawBooking';
  import Scope from '@/components/Scope';

  export default {
    name: 'home',
    components: {
      Carousel,
      TFooter,
      Tile,
      Booking,
      Parallax,
      EventTile,
      Cart,
      RawBooking,
      Scope
    },
    data: () => {
      return {
        totalPrice: 0,
        logo: require('../assets/logo_v.jpg'),
        simpleLogo: require('../assets/logo-icon.png'),
        pricesData: [{
          img: require('../assets/bowling_1.jpg'),
          title: 'Bowling',
          className: 'font-effect-3d',
          tag: '<strong>1</strong>Game',
          subtitle: 'Number 10',
          content: [{
            field: 'Adults',
            price: '$12.00'
          },{
            field: 'Students',
            price: '$10.00'
          },{
            field: 'Children (under 13 years) and Seniors',
            price: '$9.00'
          },{
            field: 'Under 5s and Disabled',
            price: '$6.00'
          }],
          href: '#'
        }, {
          img: require('../assets/bowling_1.jpg'),
          title: 'Bowling',
          className: 'font-effect-3d',
          tag: '<strong>2</strong>Games',
          subtitle: 'Number 10',
          content: [{
            field: 'Adults',
            price: '$18.00'
          },{
            field: 'Students',
            price: '$16.00'
          },{
            field: 'Children (under 13 years) and Seniors',
            price: '$15.00'
          },{
            field: 'Under 5s and Disabled',
            price: '$12.00'
          }],
          href: '#'
        }, {
          img: require('../assets/bowling_1.jpg'),
          title: 'Bowling',
          className: 'font-effect-3d',
          tag: '<strong>3</strong>Games',
          subtitle: 'Number 10',
          content: [{
            field: 'Adults',
            price: '$23.00'
          },{
            field: 'Students',
            price: '$21.00'
          },{
            field: 'Children (under 13 years) and Seniors',
            price: '$20.00'
          },{
            field: 'Under 5s and Disabled',
            price: '$17.00'
          }],
          href: '#'
        }],
        pricesData2: [
          {
            img: require('../assets/bowling_4.jpg'),
            title: 'Bowling Club',
            className: 'font-effect-fire',
            tableCls: 'no-stripe',
            tag: 'Bowling Club',
            subtitle: 'Number 10',
            content: [{
              field: 'We have Senior Bowling Club on Monday, Tuesday and Friday Mornings now. You are welcome to have a chat with us about their details. <br/>',
              price: ''
            },{
              field: '',
              price: ''
            }]
          },{
            img: require('../assets/pool_2.jpg'),
            title: 'Pool Table',
            className: 'font-effect-fire',
            tag: 'Pool Deal',
            subtitle: 'Number 10',
            content: [{
              field: '15 minutes',
              price: '$3.00'
            },{
              field: '30 minutes',
              price: '$6.00'
            },{
              field: '60 minutes',
              price: '$10.00'
            }],
            href: '#'
          },{
            img: require('../assets/game_1.jpg'),
            title: 'Arcade Games',
            className: 'font-effect-neon monoton-font',
            tag: 'Token Deal',
            subtitle: 'Number 10',
            tableCls: 'no-stripe',
            hideBtn: false,
            content: [{
              field: '13 Tokens',
              price: '$10.00'
            },{
              field: '',
              price: ''
            },{
              field: '',
              price: ''
            }],
            href: '#'
          }
        ],
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
          name: 'Price Calculator',
        }, {
          icon: 'cake',
          name: 'Birthday Party',
        }, {
          icon: 'extension',
          name: 'Tournaments',
        }, {
          icon: 'assignment_turned_in',
          name: 'Make a booking',
        }, {
          icon: 'contact_mail',
          name: 'Contact Us',
        }],
        priceTiles: [{
          img: require('../assets/bowling_3.jpg'),
          price: 12,
          desc: 'Adults',
          subtitle: `<strong>1</strong> Games`,
          cls: 'orange'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 10,
          desc: 'Students',
          subtitle: `<strong>1</strong> Games`,
          cls: 'orange'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 9,
          desc: 'Children < 13 & Seniors',
          subtitle: `<strong>1</strong> Games`,
          cls: 'orange'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 6,
          desc: 'Under 5s & Disabled',
          subtitle: `<strong>1</strong> Games`,
          cls: 'orange'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 18,
          desc: 'Adults',
          subtitle: `<strong>2</strong> Games`,
          cls: 'green'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 16,
          desc: 'Students',
          subtitle: `<strong>2</strong> Games`,
          cls: 'green'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 15,
          desc: 'Children < 13 & Seniors',
          subtitle: `<strong>2</strong> Games`,
          cls: 'green'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 12,
          desc: 'Under 5s & Disabled',
          subtitle: `<strong>2</strong> Games`,
          cls: 'green'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 23,
          desc: 'Adults',
          subtitle: `<strong>3</strong> Games`,
          cls: 'purple'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 21,
          desc: 'Students',
          subtitle: `<strong>3</strong> Games`,
          cls: 'purple'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 20,
          desc: 'Children < 13 & Seniors',
          subtitle: `<strong>3</strong> Games`,
          cls: 'purple'
        }, {
          img: require('../assets/bowling_3.jpg'),
          price: 17,
          desc: 'Under 5s & Disabled',
          subtitle: `<strong>3</strong> Games`,
          cls: 'purple'
        }, {
          img: require('../assets/pool_3.jpg'),
          price: 6,
          desc: 'Pool Table',
          subtitle: '30 Mins',
          cls: 'orange',
          unit: 30
        }, {
          img: require('../assets/pool_3.jpg'),
          price: 10,
          desc: 'Pool Table',
          subtitle: '60 mins',
          cls: 'green',
          unit: 60
        }, {
          img: require('../assets/game_1.jpg'),
          price: 10,
          desc: 'Arcade Games',
          subtitle: '13 Toks',
          cls: 'orange',
          unit: 13
        }]
      };
    },
    watch: {
      group() {
        this.drawer = false;
      }
    },
    computed: {
      computedTotalPrice() {
        return `Total: <strong class="orange--text">$${this.totalPrice}.00</strong>`
      }
    },
    methods: {
      scrollTo: function (id) {
        const el = document.getElementById(id);
        if (el) {
          const offsetTop = el.offsetTop || 0;
          window.scrollTo({
            top: offsetTop,
            left: 0,
            behavior: 'smooth'
          });
        }
      },
      click: function (item) {
        switch (item.icon) {
          case 'assignment_turned_in':
            this.dialog = !this.dialog;
            break;
          case 'monetization_on':
          case 'people':
          case 'cake':
          case 'home':
          case 'fiber_new':
          case 'extension':
          case 'contact_mail':
            this.drawer = !this.drawer;
            this.scrollTo(item.icon);
            break;
        }
      },
      resetCalc: function() {
        this.totalPrice = 0;
        this.$refs.priceForm.reset()
      },
      update: function ({ selected, total, increase }) {
        let totalPrice = this.totalPrice || 0;
        total = total || 0;
        if (selected && increase) {
          totalPrice += Number(increase);
        } else if (selected) {
          totalPrice += Number(total);
        } else {
          totalPrice -= Number(total);
        }
        this.totalPrice = totalPrice;
      }
    }
  };
</script>
<style lang="stylus">
  button.v-expansion-panel-header.primary.theme--light.price-header
    padding 4px 16px
    h3,i
      color #fff!important
      font-size 1.25rem
  .contact-panel
    position relative
    iframe
      width 100%
  .contact-tile
    padding 9px 4px 9px 11px
    top 57px
    left 0
    position absolute
    background-color white
    margin 10px
    padding 1px
    box-shadow rgba(0, 0, 0, 0.3) 0px 1px 4px -1px
    border-radius 2px
  .rancho-font
    font-family Rancho, Roboto, sans-serif
  .monoton-font
    font-family Monoton, Roboto, sans-serif
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
  .cart-booking-btn
    margin-left: 8px;
  @media (max-width: 768px)
    .contact-tile
    .v-dialog
      margin 8px!important
    .cart-booking-btn
      margin-left 0px
      margin-top 8px
      width 100%
    .cart-total-price
      margin-top 8px
    .cart-reset-btn
      width 100%
  @media (max-width: 320px)
    .map-icon
      display none!important
  .entry-content
    font-family roboto , sans-serif


  .entry-content li
    list-style none


  .entry-content a
    text-decoration none
    color #2199e8
    text-decoration none
    line-height inherit
    cursor pointer
    font-size 2rem

  .entry-header
    display none

  .wp-block-latest-posts__post-author
    margin-top 8px
    margin-bottom 5px
    font-size 0.94rem

  .wp-block-latest-posts__post-full-content
    margin-top 15px
    font-size 1.12rem

  time.wp-block-latest-posts__post-date
    font-size 0.7rem
</style>
