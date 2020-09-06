<template lang="pug">
  v-card
    v-img.white--text.align-end.flex(:src="img")
      v-card-title.box-shadow.text-shadow(v-if="title") {{title}}
        v-spacer
    v-btn.blue.white--text.tile-badge(large v-html="tag" rounded absolute right)
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
    props: ['img', 'title', 'subtitle', 'content', 'tag'],
    data: () => ({}),
  });
</script>
<style lang="stylus">
  .v-btn.tile-badge
      margin-top -22px
      text-shadow 1px 1px 1px #000
      strong
        display inline-block
        border-radius 50%
        background #fff
        color #000
        width 28px
        height 28px
        font-size 16px
        margin-right 3px
        margin-left -12px
        line-height 28px
        text-shadow 1px 1px 1px #ccc;
  .text-shadow
    text-shadow 1px 1px 2px #000
</style>
