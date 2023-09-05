import {
   BufferGeometry, Color,  Group, Mesh, MeshBasicMaterial, 
  Object3D,
  Points, PointsMaterial, ShaderMaterial,
  SphereBufferGeometry, Sprite, SpriteMaterial, Texture, TextureLoader, 
} from "three";

import html2canvas from "html2canvas";

import earthVertex from '../../shaders/earth/vertex.vs';
import earthFragment from '../../shaders/earth/fragment.fs';
import { lon2xyz } from "../Utils/common";
import gsap from "gsap";

export type punctuation = {
  circleColor: number,
  lightColumn: {
    startColor: number,
    endColor: number, 
  },
}

type options = {
  data: {
    startArray: {
      name: string,
      E: number, 
      N: number, 
    },
    endArray: {
      name: string,
      E: number,
      N: number, 
    }[]
  }[]
  dom: HTMLElement,
  textures: Record<string, Texture>,
  earth: {
    radius: number, 
    rotateSpeed: number,
    isRotation: boolean 
  }

}
type uniforms = {
  glowColor: { value: Color; }
  scale: { type: string; value: number; }
  bias: { type: string; value: number; }
  power: { type: string; value: number; }
  time: { type: string; value: any; }
  isHover: { value: boolean; };
  map: { value: Texture }
}

export default class earth {

  public group: Group;
  public earthGroup: Group;

  public around: BufferGeometry
  public aroundPoints: Points<BufferGeometry, PointsMaterial>;

  public options: options;
  public uniforms: uniforms
  public timeValue: number;

  public earth: Mesh<SphereBufferGeometry, ShaderMaterial>;
  public punctuationMaterial: MeshBasicMaterial;
  public markupPoint: Group;
  public waveMeshArr: Object3D[];

  public circleLineList: any[];
  public circleList: any[];
  public x: number;
  public n: number;
  public isRotation: boolean;
  public flyLineArcGroup: Group;

  constructor(options: options) {

    this.options = options;

    this.group = new Group()
    this.group.name = "group";
    this.group.scale.set(0, 0, 0)
    this.earthGroup = new Group()
    this.group.add(this.earthGroup)
    this.earthGroup.name = "EarthGroup";

    // 标注点效果
    this.markupPoint = new Group()
    this.markupPoint.name = "markupPoint"
    this.waveMeshArr = []

    // 卫星和标签
    this.circleLineList = []
    this.circleList = [];
    this.x = 0;
    this.n = 0;

    // 地球自转
    this.isRotation = this.options.earth.isRotation

    // 扫光动画 shader
    this.timeValue = 100
    this.uniforms = {
      glowColor: {
        value: new Color(0x168fff),
      },
      scale: {
        type: "f",
        value: -1.0,
      },
      bias: {
        type: "f",
        value: 1.0,
      },
      power: {
        type: "f",
        value: 4,
      },
      time: {
        type: "f",
        value: this.timeValue,
      },
      isHover: {
        value: false,
      },
      map: {
        value: null,
      },
    };

  }

  async init(): Promise<void> {
    return new Promise(async (resolve) => {
      this.createEarth(); 
      await this.createSpriteLabel() 
      this.show()
      resolve()
    })
  }

  createEarth() {
    const earth_geometry = new SphereBufferGeometry(
      this.options.earth.radius,
      50,
      50
    );


    this.uniforms.map.value = this.options.textures.earth;

    const earth_material = new ShaderMaterial({
      // wireframe:true, // 显示模型线条
      uniforms: this.uniforms,
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
    });

    earth_material.needsUpdate = true;
    this.earth = new Mesh(earth_geometry, earth_material);
    this.earth.name = "earth";
    this.earthGroup.add(this.earth);

  }

  async createSpriteLabel() {
    await Promise.all(this.options.data.map(async item => {
      let cityArry = [];
      cityArry.push(item.startArray);
      cityArry = cityArry.concat(...item.endArray);
      await Promise.all(cityArry.map(async e => {
        const p = lon2xyz(this.options.earth.radius * 1.001, e.E, e.N);
        const div = `<div class="fire-div">${e.name}</div>`;
        const shareContent = document.getElementById("html2canvas");
        shareContent.innerHTML = div;
        const opts = {
          backgroundColor: null, 
          // scale: 1,
          dpi: window.devicePixelRatio,
        };
        const canvas = await html2canvas(document.getElementById("html2canvas"), opts)
        const dataURL = canvas.toDataURL("image/png");
        const map = new TextureLoader().load(dataURL);
        const material = new SpriteMaterial({
          map: map,
          transparent: true,
        });
        const sprite = new Sprite(material);
        // const len = 5 + (e.name.length - 2) * 2;
        const len = 40;
        sprite.scale.set(len, 3, 1);
        sprite.position.set(p.x * 1.1, p.y * 1.1, p.z * 1.1);
        this.earth.add(sprite);
      }))
    }))
  }



  show() {
    gsap.to(this.group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: "Quadratic",
    })
  }

  render() {
    if (this.isRotation) {
      this.earthGroup.rotation.y += this.options.earth.rotateSpeed;
    }
  }

}