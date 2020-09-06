<template lang="pug">
  v-form(ref="form" v-model="valid" lazy-validation)
    v-text-field(
      v-model="name"
      :counter="30"
      :rules="nameRules"
      label="Name"
      prepend-icon="person"
      required)
    v-text-field(
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      prepend-icon="email"
      required)
    v-select(
      v-model="select"
      :items="items"
      prepend-icon="cake"
      :rules="[v => !!v || 'Item is required']"
      label="Event"
      required)
    v-menu(
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px")
      template(v-slot:activator="{ on, attrs }")
        v-text-field(
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
    v-checkbox(
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Subscribe to get promotion information?")
    v-btn.mr-2(
      :disabled="!valid"
      color="success"
      @click="validate") Booking
    v-btn(
      color="error"
      @click="reset") Reset

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
      valid: true,
      name: '',
      nameRules: [
        (v: any) => !!v || 'Name is required',
        (v: any) => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
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
        this.dateFormatted = this.formatDate(this.date)
      },
    },

    methods: {
      validate() {
        this.$refs.form.validate();
        this.bookingFn && this.bookingFn();
      },
      reset() {
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
        return this.formatDate(this.date)
      },
    }
  });
</script>
