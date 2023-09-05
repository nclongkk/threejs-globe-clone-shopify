import {
  MeshBasicMaterial, PerspectiveCamera,
  Scene, ShaderMaterial, WebGLRenderer
} from "three";
import {
  OrbitControls
} from "three/examples/jsm/controls/OrbitControls";

// interfaces
import { IWord } from '../interfaces/IWord'

import { Basic } from './Basic'
import Sizes from '../Utils/Sizes'
import { Resources } from './Resources';

// earth 
import Earth from './Earth'
import Data from './Data'

export default class World {
  public basic: Basic;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer
  public controls: OrbitControls;
  public sizes: Sizes;
  public material: ShaderMaterial | MeshBasicMaterial;
  public resources: Resources;
  public option: IWord;
  public earth: Earth;


  constructor(option: IWord) {
    /**
     * 加载资源
     */
    this.option = option

    this.basic = new Basic(option.dom)
    this.scene = this.basic.scene
    this.renderer = this.basic.renderer
    this.controls = this.basic.controls
    this.camera = this.basic.camera

    this.sizes = new Sizes({ dom: option.dom })
      this.renderer.setSize(Number(this.sizes.viewport.width), Number(this.sizes.viewport.height))
      this.camera.aspect = Number(this.sizes.viewport.width) / Number(this.sizes.viewport.height)
      this.camera.updateProjectionMatrix()

    this.resources = new Resources(async () => {
      await this.createEarth()
      this.render()
    })
  }

  async createEarth() {
    console.log('create earth')
    this.earth = new Earth({
      data: Data,
      dom: this.option.dom,
      textures: this.resources.textures,
      earth: {
        radius: 80,
        rotateSpeed: 0.001,
        isRotation: true
      }
    })

    this.scene.add(this.earth.group)

    await this.earth.init()

    const loading = document.querySelector('#loading')
    loading.classList.add('out')

  }

  public render() {
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
    this.controls && this.controls.update()
    this.earth && this.earth.render()
  }
}