<template>
  <chart-type :options="options"></chart-type>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import ChartType from '@/components/ChartType.vue'
import { onMounted, ref, watch } from 'vue'
import { getOptions, MapOption, MapDataOptions } from '@/components/chartModules/MapChart/echarts.options'

const props = defineProps<{
  data: MapDataOptions
}>()
const options = ref<MapOption>()

const renderData = () => {
  echarts.registerMap(props.data.mapName, { geoJSON: props.data.mapJson })
  options.value = getOptions(props.data)
}

watch(()=> props.data, () => {
  renderData()
}, { deep: true })

onMounted(() => {
  renderData()
})
</script>

<style scoped>

</style>
