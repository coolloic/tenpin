<template lang="pug">
  v-container
    v-row(align="center" cols="12")
      v-item-group.ml-2.mt-3.shrink.sticky(v-model="window" mondatory tag="v-flex")
        v-item(v-for="(item,n) in items" :key="n" v-slot:default="{active, toggle}")
          div.mb-2: v-btn(:input-value="active" icon @click="toggle"): v-icon.blue--text(dense) {{item.icon}}
      v-col
        v-window.elevation-1(v-model="window" vertical)
          v-window-item(v-for="(item,n in items" :key="n")
            v-card(flat)
              v-card-title
                div.flex
                  v-avatar.mr-4(color="blue"): v-icon.white--text {{item.icon}}
                  div
                    h3.title.blue--text {{item.title}}
                    v-label.text--secondary {{item.title}}
              v-card-text
                p.black--text Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              v-card-actions
                v-btn.primary(x-large) Booking
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'EventTile',
    props: [],
    data: () => ({
      items: [{
        icon: 'cake',
        title: 'Tenpin Bowling Party'
      }, {
        icon: 'local_dining',
        title: 'Tenpin Bowling Dinning'
      },{
        icon: 'local_pizza',
        title: 'Tenpin Bowling Pizza'
      },{
        icon: 'local_cafe',
        title: 'Tenpin Bowling Cafe'
      }],
      window: 0
    }),
    watch: {},

    methods: {},
    computed: {}
  });
</script>
<style lang="stylus">
  .flex
    display flex
  .sticky
    position sticky!important
    align-self baseline
    top 94px!important
</style>
