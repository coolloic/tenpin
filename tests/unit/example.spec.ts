import { shallowMount } from '@vue/test-utils'
import TFooter from "@/components/TFooter.vue";

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(TFooter)
    console.log(wrapper.contains('v-card1'));
    expect(wrapper.text()).toMatch('');
  })
})
