<script setup lang="ts">

import ChartType from '@/components/ChartType.vue'
import { BarDataOptions, BarOption, getOptions } from './echarts.options'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  data: BarDataOptions
}>()

const options = ref<BarOption>()

const renderData = () => {
  if (props.data && props.data.source) {
    options.value = getOptions(props.data)
  } else {
    options.value = {}
    console.log('props.data.source is undefined')
  }
}

watch(()=> props.data, () => {
  renderData()
}, { deep: true })

onMounted(() => {
  renderData()
})

</script>

<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <ChartType :options="options" />
  </div>
</template>

<style scoped>

</style>
