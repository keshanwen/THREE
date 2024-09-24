import three from 'three'

import { useState,useEffect, createRef } from 'react'
import * as THREE from 'three';
import './App.css'

function App() {
  const containerRef = createRef()
  // 创建场景对象
  const scene = new THREE.Scene()

  // 创建网格模型
  const geometry = new THREE.BoxGeometry(100,100,100) // 创建一个立方体几何对象 Geometry
  const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff
  }) // 材质对象
  const mesh = new THREE.Mesh(geometry,material) // 网格模型对象 Mesh
  scene.add(mesh)

  // 光源设置
  // 点光源
  const point = new THREE.PointLight(0xffffff)
  point.position.set(400,200,300) // 点光源位置
  scene.add(point)

  // 环境光
  const ambient = new THREE.AmbientLight(0x444444)
  scene.add(ambient)


  // 相机设置
  const width = 400
  const height = 400
  // var width = window.innerWidth; //窗口宽度
  // var height = window.innerHeight; //窗口高度
  const k = width / height
  const s = 200
  const camera = new THREE.OrthographicCamera(-s * k, s * k,s,-s,1,1000)
  camera.position.set(200,300,200) // 设置相机位置
  camera.lookAt(scene.position)

  // 场景渲染器对象
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width,height) // 设置渲染区域的尺寸
  renderer.setClearColor(0xb9d3ff,1) // 设置背景颜色

  // 执行渲染操作， 指定场景，相机作为参数
  renderer.render(scene,camera)

  useEffect(() => {
    // Mounted
    containerRef.current.appendChild(renderer.domElement)
    //document.body.appendChild(renderer.domElement)
    return () => {
      // unMounted
    }
  },[])

  return (
    <>
      <div ref={containerRef} className='container'>

      </div>
    </>
  )
}

export default App
