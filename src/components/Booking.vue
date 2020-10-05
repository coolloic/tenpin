<template lang="pug">
  v-form(ref="form" v-model="valid" lazy-validation method="post" action="/#wpcf7-f68-p2-o1")
    .hidden
      input(type="hidden" name="_wpcf7" value="68")
      input(type="hidden" name="_wpcf7_version" value="5.2.2")
      input(type="hidden" name="_wpcf7_locale" value="en_US")
      input(type="hidden" name="_wpcf7_unit_tag" value="wpcf7-f68-p2-o1")
      input(type="hidden" name="_wpcf7_container_post" value="2")
      input(type="hidden" name="_wpcf7_posted_data_hash" value="")
    v-text-field(
      name="your-name"
      v-model="name"
      :counter="30"
      :rules="nameRules"
      label="Name"
      prepend-icon="person"
      required)
    v-text-field(
      name="your-email"
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      prepend-icon="email"
      required)
    v-text-field(
      name="your-phone"
      v-model="phone"
      label="Phone"
      prepend-icon="phone"
      required)
    v-text-field(
      type="number"
      name="people"
      v-model="people"
      label="Number of People"
      prepend-icon="people"
      required)
    v-menu.hidden(
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px")
      template(v-slot:activator="{ on, attrs }")
        v-text-field(
          name="date"
          v-model="dateFormatted"
          label="Date"
          hint="MM/DD/YYYY"
          placeholder="MM/DD/YYYY format"
          persistent-hint
          prepend-icon="event"
          v-bind="attrs"
          @blur="date = parseDate(dateFormatted)"
          v-on="on")
      v-date-picker(v-model="date" no-title @input="menu1 = false")
    v-textarea.mt-1(outlined label="Comment" dense hide-details name="your-message")
    v-btn.mr-2.mt-2(
      :disabled="!valid"
      color="success"
      @click="validate") Booking
    v-btn.mt-2(
      color="error"
      @click="reset") Reset
    v-btn#submit.hidden(type="submit") submit

</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Carousel',
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
</style>
