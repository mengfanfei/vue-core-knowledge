<template>
  <div class="flex justify-center items-center w-screen h-screen">
    <div class="w-200 h-150 border-gray border-1 border-solid rounded-lg border-opacity-50 flex overflow-hidden">
      <div class="h-full w-50"></div>
      <div class="flex-1 bg-zinc-50">
        <div></div>
        <div class="input-container">
          <a-input type="textarea"></a-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>


<style lang="scss" scoped>
.input-container {
  height: 200px;
  width: 100%;
  textarea {
    border: none;
    width: 100%;
    height: 100%;
    padding: 0;
    &:focus-visible {
      border: none;
    }
  }
}
</style>