<template lang="html">

</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'rawBooking',
    props: ['bookingFn'],
    data: (vm: any) => ({
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      valid: false,
      name: '',
      nameRules: [
        (v: any) => !!v || 'Name is required',
        (v: any) => (v && v.length <= 30) || 'Name must be less than 30 characters',
      ],
      people: 1,
      phone: '',
      email: '',
      emailRules: [
        (v: any) => !!v || 'E-mail is required',
        (v: any) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      select: null,
      items: [
        'PINS PARTY',
        'PINS PIZZA PARTY',
        'PINS ALL YOU CAN EAT',
        'PINS FUN ON THE RUN',
      ],
      checkbox: false,
    }),
    watch: {
      date(val) {
        //@ts-ignore
        this.dateFormatted = this.formatDate(this.date)
      },
    },

    methods: {
      validate() {
        //@ts-ignore
        const valid = this.$refs.form.validate();
        if(valid){
          //@ts-ignore
          this.bookingFn && this.bookingFn();
          document.getElementById("submit")!.click();
        }
      },
      reset() {
        //@ts-ignore
        this.$refs.form.reset()
      },
      formatDate(date): string | null {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate(date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },
    computed: {
      computedDateFormatted() {
        //@ts-ignore
        return this.formatDate(this.date)
      },
    }
  });
</script>
<style lang="stylus">
  .hidden
    display none!important
  .wpcf7
    display none!important
  .wpcf7-form-control
    border: 1px solid #ccc
    width: 100%
    border-radius: 5px
    min-height: 40px
    padding: 3px 5px


  input.wpcf7-form-control.wpcf7-submit
    background: #1976d2
    color: #fff
    font-size: 1.4rem
    min-height:40px

  input.wpcf7-form-control.wpcf7-number.wpcf7-validates-as-number
    width: 100%
</style>
