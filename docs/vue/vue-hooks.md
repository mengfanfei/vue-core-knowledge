# Vue Hooks

## 1. useEvent
```js
import { onMounted, onBeforeUnmount } from 'vue'
export function useEvent(event, handler, options) {
  // Default to targeting the window
  const {
    target = window
    ...listenerOptions
  } = options

  onMounted(() => {
    target.addEventListener(event, handler, listenerOptions)
  })

  onBeforeUnmount(() => {
    target.removeEventListener(event, handler, listenerOptions)
  })
}
```
```js
useEvent('click', () => {
  console.log('click')
}, {
  target: buttonElement
})
```