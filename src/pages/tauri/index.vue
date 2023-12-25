<template>
  <div>tauri</div>
  <div>{{ name }}</div>
  <button @click="handleDialog">调用dialog</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getName, hide } from '@tauri-apps/api/app'
import { ask, confirm } from '@tauri-apps/api/dialog'
import { Modal, message } from 'ant-design-vue'
const name = ref('')

const handleDialog = async () => {
  // const yes = await ask('yes or no', '提示')
  const yes2 = await ask('This action cannot be reverted. Are you sure?', { title: 'Tauri', type: 'warning' });
  const confirmed = await confirm('Are you sure?', {title: 'Tauri', type: 'warning' });
  Modal.confirm({
    title: 'Tauri',
    content: 'This action cannot be reverted. Are you sure?',
    okText: 'Yes',
    cancelText: 'No',
  })
  message.success('success!!!!')
  await hide()
}


onMounted(async () => {
  name.value = await getName()
})
</script>
