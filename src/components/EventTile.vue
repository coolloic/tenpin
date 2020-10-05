<template lang="pug">
    v-container
        v-row(align="center" cols="12")
          v-col
            v-card
              v-toolbar.light-blue(flat dark)
                v-toolbar-title Birthday Party
                  .subtitle-2.text--secondary Party room are free to use with booking. We only provide table cloths. You can bring your food and soft drinks. Also, you are welcome to decorate the party room.
              v-tabs.event-tabs(show-arrows=false style="min-width: 100%")
                v-tab.blue--text.darken-5.event-tab(v-for="(item,i) in items" :key="i") {{item.title}}
                  v-icon.ml-2.blue--text.darken-5(left) {{item.icon}}
                v-tab-item(v-for="(item,i) in items" :key="i")
                  v-card(flat)
                    v-card-text
                      .flex.flex-break
                        img.event-img(max-width="50%" :src="require('../assets/bowling_birthday.jpg')")
                        div.ml-2.mr-2.flex-grow-1
                          .flex.flex-break
                            h2.blue--text.event-title {{item.title}}
                            v-spacer
                            label.price-label.black--text {{item.price}}
                          v-divider.mt-2.mb-2
                          v-list.stripe
                            v-list-item.ma-0.border-bt(v-for="(item,i) in item.content" :key="i")
                              v-list-item-content.pl-1.bold.bullet-item(v-html="item")
                              v-list-item-action
                                v-icon.orange--text star
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
        title: 'Bowling + Food',
        content: ['1 Game - $16 per Child', '2 Games - $22 per child', 'Food Option: <ol><li>Mini Hotdogs</li><li>Chicken Nuggets</li><li>Vegetable Spring Rolls</li><li>Samosas</li></ol><b>(Choose One) + Chips  Per Child</b>'],
        price: ''
      }, {
        icon: 'cake',
        title: 'Games Only',
        content: ['1 Game - $6 per Child (Under 5) or $9 per Child (Under 13)', '2 Games -  $12 per Child (Under 5) or $15 per Child (Under 13)'],
        price: ''
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
  .bold
    font-weight bold
  h3
    word-break normal
  .flex
    display flex
    align-items center
  .sticky
    position sticky!important
    align-self baseline
    top 94px!important
  .box-shadow
    box-shadow 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)
  .event-img
    align-self baseline
    max-width 550px
    width 100%
    object-fit contain
    object-position top
  .event-tab
    border-bottom 1px solid #eee
    flex-grow 1!important
  .event-tab + .event-tab
    border-left 1px solid #eee
  .event-tab:last-child
    border-right 1px solid #eee
  .event-tabs .v-slide-group__prev--disabled
    display none!important
  .stripe .v-list-item:nth-child(2n)
    background #eee
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
  .bullet-item li
    margin 6px 0
</style>
