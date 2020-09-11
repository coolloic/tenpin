<template lang="pug">
  v-card
    iframe(src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3201.570454376782!2d174.74292801582047!3d-36.63672487998243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d2511a8e9fcf5%3A0x3a8d36ec8a94528!2s14%20Link%20Crescent%2C%20Stanmore%20Bay%2C%20Auckland%200932!5e0!3m2!1sen!2snz!4v1599806836134!5m2!1sen!2snz" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0")
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Map',
    data: () => ({
    }),
  });
</script>
