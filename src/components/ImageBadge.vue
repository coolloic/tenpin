<template lang="pug">
  .super-tile
    .super-tile__label__wrapper
      .super-tile__label.font-weight-bold {{title}}
    .super-tile__overlay
    .super_tile__img
      img(:src="img")
    .super_tile__caption
      .super_tile__caption__heading.font-effect-fire.align-content-end(v-if="heading" )
        h3 {{heading}}
      .super_tile__caption__content(v-if="content" )
        p {{content}}
      .super_tile__caption__link(v-if="link" )
        a {{link}}
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ImageBadge',
  props: ['title', 'img', 'heading', 'content', 'link'],
  data: () => ({}),
  methods: {
    click() {
      this.$emit('click', {})
    }
  }
});
</script>

<style lang="stylus" scoped>
.super-tile-component [class^="col-lg-"] {
  margin-bottom: 30px;
}

.super-tile-component .slick-dots li button:before {
  font-size: 20px;
  line-height: 20px;
}

.super-tile {
  height: 360px;
  display: block;
  position: relative;
  transition: .3s;
  overflow: hidden;

  .super-tile__label__wrapper {
    position: absolute;
    top: 0;
    left: 0;

    .super-tile__label {
      text-transform: uppercase;
      background: #000
      padding: 10px 30px;
      margin: 0;
      max-width: 100%;
      display: inline-block;
      position: relative;
      font-size 1.5rem
      font-weight bold
      font-family 'Oxygen Mono', monospace
      color orange

      &:after {
        content: ' ';
        display: block;
        width: 40px;
        background: #000
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        margin-right: -20px;
        border-radius: 0 0 8px;
        transform: skewX(-20deg);
      }
    }
  }

  .super-tile__overlay {
    position: absolute;
    display: none;
    content: ' ';
    height: 100%;
    width: 100%;
    background-color: #000;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    background: -webkit-linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .6));
    background: -o-linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .6));
    background: -moz-linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .6));
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .6));
  }

  .super_tile__img img {
    display: block;
    width 100%
    object-fit: cover;
  }

  .super_tile__caption {
    position: absolute;
    bottom: 0;
    left: 0;
    color: #fff;
    padding: 30pxs;
    width 100%
    .super_tile__caption__heading {
      display block
      text-align right
    }

    .super_tile__caption__heading h3 {
      font-size: 4rem;
      color: #fff;
      display inline-block
      padding 20px
      border-radius 50%
    }

    .super_tile__caption__content p {
      color: #fff;
    }

    .super_tile__caption__link {
      position: relative;

      &:after {
        display: inline-block;
        font: normal normal normal 14px / 1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        content: "\f105";
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0;
        transition: .3s;
        padding-right: 20px;
        font-size: 30px;
        line-height: 19px;
      }

      a {
        color: #fff;
        text-decoration: none;
      }
    }
  }

  &.super-tile__shadow .super-tile__overlay {
    display: block;
  }

  &.hide-img .super_tile__img {
    visibility: hidden;
  }

  &:hover {
    cursor: pointer;
    border-color: #66afe9;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);

    .super_tile__caption__link:after {
      opacity: 1;
      padding-right: 10px;
    }
  }
}

//@media (max-width: 1024px) {
//  .super-tile-component [class^="col-lg-"] {
//    margin-bottom: 15px;
//    padding: 0 8px;
//  }
//
//  .super-tile {
//    height: auto;
//
//    .super_tile__caption {
//      padding: 15px;
//
//      .super_tile__caption__link:after {
//        opacity: 0;
//        padding-right: 10px;
//      }
//    }
//  }
//}
</style>
