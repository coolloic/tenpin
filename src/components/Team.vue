<template lang="pug">
  v-container
    v-row(justify="center")
      v-subheader ''
      v-expansion-panels(popout)
        v-expansion-panel(v-for="(t, i) in team" :key="i" hide-actions)
          v-expansion-panel-header
            v-row(align="center" class="spacer" no-gutters)
              v-col(cols="4" sm="2" md="1")
                v-avatar(size="36px")
                  img(v-if="t.avatar" alt="Avatar" src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460")
                  v-icon(v-else :color="t.color" v-text="t.icon")
              v-col(class="hidden-xs-only" sm="5" md="3")
                strong(v-html="t.name")
              v-col(class="text-no-wrap" cols="5" sm="3")
                strong(v-html="t.title")
              v-col(v-if="t.excerpt" class="grey--text text-truncate hidden-sm-and-down") {{ t.excerpt }}
          v-expansion-panel-content
            v-divider
            v-card-text(v-html="t.content")
</template>

<script lang="ts">

import Vue from "vue";

export default Vue.extend({
  name: 'team',
  data: () => ({
    team: [
      {
        color: '#1976d2',
        icon: 'home',
        name: 'About Us',
        content: 'Whangaparaoa Tenpin bowling has multiple entertainment service for the local people. We have 12 bowling lanes, 18 arcade machine and gaming Lodge for customer to choosing. \n' +
          'We have three regular bowling leagues and one Special Olympic Group running at moment. And, we had lots of local company having the annual party here. \n',
      }, {
        color: '#1976d2',
        icon: 'mdi-account-multiple',
        name: 'Team Information',
        content: `Manager: YINHE CHEN<br/>IT Support: MARK WANG<br/>Staff:LI XIANG, GARY COLLINS,WENJINGHAO ZHENG`
      }],
  })
})
</script>

<style scoped lang="stylus">

</style>
