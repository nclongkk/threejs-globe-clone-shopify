/**
 * 创建 threejs 四大天王
 * 场景、相机、渲染器、控制器
 */

import * as THREE from 'three';
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

export class Basic {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer
  public controls: OrbitControls;
  public dom: HTMLElement;

  constructor(dom: HTMLElement) {
    this.dom = dom
    this.initScenes()
    this.setControls()
  }

  /**
   * 初始化场景
   */
  initScenes() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      100000
    );
    this.camera.position.set(0, 30, -250)


    this.renderer = new THREE.WebGLRenderer({
      alpha: true, // 透明
      antialias: true, // 抗锯齿
    });
    this.renderer.setPixelRatio(window.devicePixelRatio); 
    // this.renderer.setSize(window.innerWidth, window.innerHeight); 
    this.dom.appendChild(this.renderer.domElement); 
    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight);
  }

  /**
   * 设置控制器
   */
  setControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotateSpeed = 3
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 300;
    this.controls.enablePan = true;
  }
}