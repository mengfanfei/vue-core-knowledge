import { onMounted, shallowRef } from "vue"

export function useCanvas(CanvasElementID: string, callback?: Function) {
  const canvas = shallowRef<HTMLCanvasElement>()
  const context = shallowRef<CanvasRenderingContext2D>()
  onMounted(() => {
    canvas.value = document.getElementById(CanvasElementID) as HTMLCanvasElement
    context.value = canvas.value.getContext('2d') as CanvasRenderingContext2D
    callback && callback()
  })

  return {
    canvas,
    context
  }
}