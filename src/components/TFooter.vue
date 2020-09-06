<template lang="pug">
  -copyright = "Copyright &#169; 2020 L.J.K Consultant Limited";
  v-footer(padless dark)
    v-card.flex.text-center(flat tile)
      v-card-title.blue.darken-3
        div.width-1440
          strong.subheading Get Connected with us on social networks!
          v-spacer
          v-btn(
            v-for="icon in icons"
            :key="icon"
            class="mx-4"
            dark
            icon)
            v-icon(size="24") {{icon}}
      v-card-text.py-2.white--text.text-center !{copyright}

</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'TFooter',
    data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ]
    }),
  });
</script>
