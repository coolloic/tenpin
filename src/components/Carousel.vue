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
          src: require('../assets/banner-1.jpg'),
        },
        {
          src: require('../assets/banner-2.jpg'),
        },
        {
          src: require('../assets/banner-3.jpg'),
        }]
    }),
  });
</script>
