import World  from './world/Word'

const dom: HTMLElement = document.querySelector('#earth-canvas');
if (!dom.innerHTML) {
  new World({
    dom,
  })
}