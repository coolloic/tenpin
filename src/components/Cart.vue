<template lang="pug">
  v-card.v-sheet.pa-2(:class="`v-tile tile-${cls} ${selected ? 'selected-card' : ''}`")
    .shop-card.white(:class="")
      img.shop-card__badge(:src="img")
      .shop-card__header.ml-1.mr-1
        h3.shop-card__header__title.orange--text.mb-2 ${{price}}.00
        v-divider
        p.shop-card__header__desc.mt-1.mb-0(v-html="desc")
        h5.shop-card__header__subtitle.pa-0.ma-0(v-html="subtitle")
      v-divider(vertical)
      .shop-card__form.ml-2
        label.shor-card__price.green--text.bold(v-if="amount !== 0" :data="[id,selected,total]") ${{total}}.00
        h5(v-if="unit === 30 && amount !== 0") {{time}}
        h5(v-else-if="unit === 60 && amount !== 0") {{amount}}h
        h5(v-else-if="unit === 13 && amount !== 0") {{amount * 13}} Toks
        h5(v-else-if="amount !== 0") {{amount}} {{amount > 1 ? 'People' : 'Person' }}
        v-checkbox.shop-card__form__checkbox.ml-1.mt-0.mb-0.pa-0(v-model="selected" :class="`checkbox_${id}`")
        v-slider.shop-card__form__slider.blue--text.pa-0(v-model="amount" min=0 max=20 thumb-label thumb-size=20 hide-details
        append-icon="add_circle" prepend-icon="remove_circle" @click:append="increase" @click:prepend="reduce" thumb-color="blue")


</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Cart',
    props: ['price', 'title', 'subtitle', 'img', 'desc', 'cls', 'id', 'unit'],
    data: () => ({
      amount: 0,
      selected: false
    }),
    methods: {
      increase() {
        //@ts-ignore
        this.amount = this.amount + 1 > 20 ? 20 : (this.amount + 1);
      },
      reduce() {
        //@ts-ignore
        this.amount = this.amount - 1 < 1 ? 0 : this.amount - 1;
      }
    },
    watch: {
      total: {
        immediate: true,
        handler(value, old) {
          let increase = Number(value || 0) - Number(old || 0);
          //@ts-ignore
          this.$emit('update', {selected: this.selected, increase: increase || 0});
        }
      },
      selected: {
        immediate: true,
        handler(value) {
          //@ts-ignore
          this.$emit('update', {selected: value, total: this.total});
        }
      }
    },
    computed: {
      total() {
        return Number(this.amount) * Number(this.price);
      },
      time() {
        let h = Number(this.amount) / 2;
        let m = Number(this.amount) % 2;
        let text = ''
        if (h === 1) {
          text = '1h'
        } else if (h > 1) {
          text = `${h}h`
        }
        if (m > 0) {
          text += ' 30m'
        }
        if (text === '') {
          text = '0h';
        }
        return text;
      }
    }
  });
</script>
<style lang="stylus">
  .shop-card
    width 100%
    display flex
    position relative

    &__badge
      width 86px
      height 86px

    &__header
      width 60px

      &__title
        display block

      &__desc
        font-size .65rem
        font-weight bold
        line-height 1
        min-height 27px

      &__subtitle
        display block

        strong
          background purple
          color #fff
          border-radius 50%
          width 14px
          height 14px
          line-height 14px
          font-size 12px
          display inline-block
          text-align center


    &__figure
      image
        max-width 100%

    &__form
      flex-grow 1
      position relative

      &__checkbox
        position absolute
        right 0
        top 0
        transform translate(15px, -5px)

      &__slider
        position absolute
        bottom 0
        right 0
        width 100%
        .v-input__prepend-outer,.v-input__append-outer
          margin-right 0!important
          margin-left 0!important
          i
            color #2196f3

  .v-tile
    &:before
      content ""
      display inline-block
      position absolute
      right 0
      top 50%
      margin-top -4px
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 8px solid blue;

  .tile
    &-orange
      position relative
      border-right 5px solid orange !important

      &:before
        border-right: 8px solid orange;

    &-purple
      border-right 5px solid purple !important

      &:before
        border-right: 8px solid purple;

    &-green
      border-right 5px solid green !important

      &:before
        border-right: 8px solid green;

</style>
