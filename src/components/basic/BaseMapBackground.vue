<template lang="pug">
  g.map
    path(
      :fill="fill || 'white'"
      :stroke="stroke || 'white'"
      :d="path")
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class Map extends Vue {
    @Prop() private fill!: number;

    @Prop() private stroke!: number;

    @Prop() private path!: string;
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  g.map
    cursor move
</style>
