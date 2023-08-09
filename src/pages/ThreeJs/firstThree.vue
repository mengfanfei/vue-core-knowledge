<template>
  <div id="firstThreePage"></div>
</template>
    
<script setup lang='ts'>
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, LineBasicMaterial, Vector3, BufferGeometry, Line } from 'three'
import { onMounted } from 'vue';

const scene = new Scene()

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500)
camera.position.set( 0, 0, 10 );
camera.lookAt( 0, 0, 0 );

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const geometry = new BoxGeometry( 1, 1, 1 )
const material = new MeshBasicMaterial( { color: 0x00ff00 } )
const cube = new Mesh( geometry, material )
scene.add( cube )

const material2 = new LineBasicMaterial( { color: 0x0000ff } );

const points = [];
points.push( new Vector3( -5, 0, 0 ) );
points.push( new Vector3( 0, 5, 0 ) );
points.push( new Vector3( 5, 0, 0 ) );

const geometry2 = new BufferGeometry().setFromPoints( points );

const line = new Line(geometry2, material2)

scene.add(line)

// camera.position.z = 5

function animate() {
  requestAnimationFrame( animate )
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render( scene, camera )
}

onMounted(() => {
  const element = document.getElementById('firstThreePage') as HTMLElement
  element.appendChild(renderer.domElement)

  animate()
})
</script>
    
<style>
    
</style>