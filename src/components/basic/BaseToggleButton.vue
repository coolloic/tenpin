<template lang="pug">
    .checkbox-field
        input(
            type="checkbox"
            :id="name"
            :checked="value"
            :name="name"
            @change="onChangedEvent")
        label(
            :for="name"
            :title="'Toggle' + name") {{name}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
export default class Badge extends Vue {
        @Prop() name!: number;

        @Prop() value!: string;

        @Prop() changeCallback!: any;

        onChangedEvent(event: any) {
          if (this.changeCallback) { this.changeCallback(event); }
        }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    input
        line-height 18px
        display none

    label
        position relative
        padding 3px 5px 3px 5px
        cursor pointer
        border-radius 5px
        border 1px solid lightgray

    input:checked + label
        background-color #07c
        color #fff

    i
        margin-left 5px
</style>
