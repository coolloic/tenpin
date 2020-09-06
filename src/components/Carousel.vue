<template lang="pug">
  v-carousel(progress progress-color='red' cycle)
    v-carousel-item(
      v-for="(item,i) in items"
      :key="i"
      :src="item.src")

</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Carousel',

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
