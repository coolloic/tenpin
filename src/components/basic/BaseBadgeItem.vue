<template lang="pug">
    label.badge()
        b {{counter}}
        = '{{text}}'
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
export default class Badge extends Vue {
        @Prop() counter!: number;

        @Prop() text!: string;
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    .badge
        text-transform uppercase
        display inline-block
        padding 5px 10px
        background-color #70c
        color #fff
        margin 0 5px
        border-radius 5px

        b
            background-color #fff
            color #70c
            border-radius 5px
            padding 0 5px
            margin-right 5px
</style>
