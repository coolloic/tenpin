<template lang="pug">
  v-card
    v-img.white--text.align-end(:src="img")
      v-card-title(v-if="title") {{title}}
    v-card-subtitle.pb-0(v-if="subtitle") {{subtitle}}
    v-card-text.text--primary(v-if="content")
      p.black--text {{content}}
    v-card-actions
      v-btn(text color="blue") Read More

</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Tile',
    props: ['img', 'title', 'subtitle', 'content'],
    data: () => ({
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
        }]
    }),
  });
</script>
