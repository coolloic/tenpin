<template lang="pug">
    v-container
        v-row(align="center" cols="12")
          v-col
            v-card
              v-toolbar(flat color="purple" dark)
                v-toolbar-title Special Deals
              v-tabs(show-arrows=false)
                v-tab.purple--text(v-for="(item,i) in items" :key="i") {{item.title}}
                  v-icon.ml-2.purple--text(left) {{item.icon}}
                v-tab-item(v-for="(item,i) in items" :key="i")
                  v-card(flat)
                    v-card-text
                      .flex.flex-break
                        img.event-img(max-width="50%" src="https://freedesignfile.com/upload/2018/08/Bowling-tournament-poster-design-vector-06.jpg")
                        div.ml-2.mr-2.flex-grow-1
                          .flex.flex-break
                            h2.blue--text.event-title {{item.title}}
                            v-spacer
                            label.price-label.black--text {{item.price}}
                          v-divider.mt-2.mb-2
                          p.black--text {{item.content}}
                          v-spacer
                          v-btn.primary.booking-btn.float-right(x-large @click="click") Booking
                            v-icon assignment_turned_in

</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'EventTile',
    props: [],
    data: () => ({
      items: [{
        icon: 'cake',
        title: 'Tenpin Bowling Party',
        content: 'Bring the whole family down for an hour of fun. Only $30 per lane for 1 hour for up to 6 people! (must have at least 1 adult and 1 child under 15)\n' +
          'Monday to Friday 4pm-6pm & Sundays 9:30am-11:30am',
        price: '$30 per hour'
      }, {
        icon: 'local_dining',
        title: 'Rent a Lane (per lane)',
        content: 'Take some time out during the week with this great deal. Only $40 per lane for 1 hour for up to 6 people!\n' +
          'Monday to Friday 10am-4pm (not valid School or Public Holidays)',
        price: '$40 per hour'
      },{
        icon: 'local_pizza',
        title: 'Bowl till you drop (per person)',
        content:'Sundays, Mondays & Tuesdays 7.30pm-11.30pm\n' +
          '4 hours unlimited bowling. Minimum 3 bowlers per lane',
        price: '$22 (for 4 hours)'
      },{
        icon: 'local_cafe',
        title: 'Disco Bowling (per person)',
        content: 'Friday & Saturday Nights from 8.30pm\n' +
          'A free drink from the bar with 3 games per person purchased!',
        price: 'Price Varies'
      },{
        icon: 'local_cafe',
        title: 'Late Night Out',
        content: 'No one looks back on life and remembers the nights they got plenty of sleep! Two Games for the price of one (per person) Friday & Saturday Nights from 9.30pm (games must be completed by Midnight)',
        price: 'Buy 1 game, get your 2nd game FREE'
      }],
      window: 0
    }),
    watch: {},

    methods: {
      click(){
        this.$emit('click',{})
      }
    },
    computed: {}
  });
</script>
<style lang="stylus">
  h3
    word-break normal
  .flex
    display flex
  .sticky
    position sticky!important
    align-self baseline
    top 94px!important
  .box-shadow
    box-shadow 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)
  .event-img
    max-width 350px
    width 100%
  @media (max-width:768px)
    .flex-break
      display block
    .v-responsive.v-image
        flex-wrap wrap
        width 100%
    .event-img
      max-width 100%
    .event-title
      margin-bottom 4px
</style>
