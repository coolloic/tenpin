<template lang="pug">
  v-parallax(:height="height" :src="img")
    slot
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Parallax',
    props: ['height', 'img'],
    data: () => ({
    }),
  });
</script>
