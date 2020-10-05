<template lang="pug">
  -copyright = "Copyright &#169; 2020 L.J.K Consultant Limited";
  .v-application
    v-footer.cool.dog(padless dark name="t-footer" :id="id")
      v-card.flex.text-center(flat tile)
        v-card-title.blue.darken-3
          div.width-1440.text-center
            strong.subheading Get Connected with us on social networks!
            v-spacer
            v-btn(
              v-for="(item,i) in icons"
              :key="i"
              class="mx-4"
              dark
              icon @click="jumpTo(item)")
              v-icon(size="24") {{item.icon}}
        v-card-text.py-2.white--text.text-center !{copyright}

</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'TFooter',
    data: () => ({
      id: 123,
      icons: [
        {icon: 'mdi-facebook', href: 'http://www.facebook.com/tenpinwgp'},
        {icon: 'mdi-twitter', href: 'http://www.facebook.com/tenpinwgp'},
        {icon: 'mdi-instagram', href: 'http://www.facebook.com/tenpinwgp'}
      ]
    }),
    methods: {
      jumpTo(item: any) {
        window.open(item.href, '_blank');
      }
    }
  });
</script>
<style lang="stylus">
  .theme--dark.v-footer
    width 100%
</style>
