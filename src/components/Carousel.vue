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
          src: 'https://pins.co.nz/wp-content/uploads/2015/04/top-slider-11.jpg',
        },
        {
          src: 'https://pins.co.nz/wp-content/uploads/2015/04/top-slider-21.jpg',
        },
        {
          src: 'https://pins.co.nz/wp-content/uploads/2015/04/top-slider-31.jpg',
        }]
    }),
  });
</script>
