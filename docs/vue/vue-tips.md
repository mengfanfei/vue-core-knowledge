# Vue Tips

## 1. directives（指令）

- 在使用`script setup`的vue组件中，您可以通过给它一个以“v”开头的驼峰命名法名称来定义自定义指令

```vue
<script setup>
const vRedBackground = {
  mounted: (el) => el.style.background = 'red'
}
</script>
<template>
  <input v-red-background />
</template>
```

- 使用 Options API
```vue
<script>
export default {
  setup() {
    ...
  },
  directives: {
    redBackground: {
      mounted: (el) => el.style.background = 'red'
    }
  }
}
</script>
```

- 全局注册指令
```js
const app = createApp({})


app.directive('redBackground', {
  mounted: (el) => el.style.background = 'red'
})
```

## 2. `<style>` v-bind
我们可以在`<style>`块中使用反应性值

```vue
<style>
  .button {
    color: v-bind(buttonColor)
  }
</style>
```

## 3. computed (set,get)
```js
const firstName = ref('')
const lastName = ref('')
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val) => {
    const split = val.split(' ')
    firstName.value = split[0]
    lastName.value = split[1]
  }
})

fullName.value = 'demacia James'
console.log(firstName.value) // demacia
```

## 4. 动态slot
我们可以在运行时动态生成slot，使我们在编写代码时更加灵活
```vue
<template>
  <div v-for="step in steps" :key="step.id">
    <slot :name="step.name" />
  </div>
</template>
```