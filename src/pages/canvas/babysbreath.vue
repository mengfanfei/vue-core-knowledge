<template>
  <canvas id="myCanvas" class="bg-black"></canvas>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  onMounted(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 3;
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    draw();
  })
</script>