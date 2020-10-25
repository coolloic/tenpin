<template lang="html">
  <form action="/#wpcf7-f68-p2-o1" method="post" class="wpcf7-form init" novalidate="novalidate">
    <div style="display: none;">
      <input type="hidden" name="_wpcf7" value="68">
      <input type="hidden" name="_wpcf7_version" value="5.2.2">
      <input type="hidden" name="_wpcf7_locale" value="en_US">
      <input type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f68-p2-o1">
      <input type="hidden" name="_wpcf7_container_post" value="2">
      <input type="hidden" name="_wpcf7_posted_data_hash" value="">
    </div>
    <p><label> Your Name (required)<br>
      <span class="wpcf7-form-control-wrap your-name"><input type="text" name="your-name" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false"></span> </label></p>
    <p><label>Phone (required) <span class="wpcf7-form-control-wrap your-phone"><input type="text" name="your-phone" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" aria-required="true" aria-invalid="false"></span></label></p>
    <p><label> Number of People (required)<br><span class="wpcf7-form-control-wrap people"><input type="number" name="people" value="" class="wpcf7-form-control wpcf7-number wpcf7-validates-as-number" min="1" max="100" aria-invalid="false"></span></label></p>
    <p><label> Your Email (required)<br>
      <span class="wpcf7-form-control-wrap your-email"><input type="email" name="your-email" value="" size="40" class="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required wpcf7-validates-as-email" aria-required="true" aria-invalid="false"></span> </label></p>
    <p><label> Date (required)<br><span class="wpcf7-form-control-wrap date"><input type="date" name="date" value="" class="wpcf7-form-control wpcf7-date wpcf7-validates-as-date" aria-invalid="false"></span></label></p>
    <p><label> Time (10am - 10pm) (required)<br><span class="wpcf7-form-control-wrap time"><input type="time" name="time" value="" class="wpcf7-form-control wpcf7-date wpcf7-validates-as-time" aria-invalid="false"></span></label></p>
    <p><label> Your Message<br>
      <span class="wpcf7-form-control-wrap your-message"><textarea name="your-message" cols="40" rows="10" class="wpcf7-form-control wpcf7-textarea" aria-invalid="false"></textarea></span> </label></p>
    <p><input type="submit" value="Send" class="wpcf7-form-control wpcf7-submit"></p>
    <div class="wpcf7-response-output" role="alert" aria-hidden="true"></div></form>
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
