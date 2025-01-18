
import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  mobileAndTabletCheck,
  BloomPlugin,
  Vector3, GammaCorrectionPlugin, MeshBasicMaterial2, Color, AssetImporter
} from "webgi";
import "./styles.css";
import "./style2.css";

import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
duration: 1.2,
easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
direction: 'vertical', // vertical, horizontal
gestureDirection: 'vertical', // vertical, horizontal, both
smooth: true,
mouseMultiplier: 1,
smoothTouch: false,
touchMultiplier: 2,
infinite: false,
})

lenis.stop()

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

  const viewer = new ViewerApp({
      canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
      // isAntialiased: true,
  })

  const isMobile = mobileAndTabletCheck()
  // console.log(isMobile)

  const manager = await viewer.addPlugin(AssetManagerPlugin)
  const camera = viewer.scene.activeCamera
  const position = camera.position
  const target = camera.target

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin)
  await viewer.addPlugin(new ProgressivePlugin(32))
  await viewer.addPlugin(new TonemapPlugin(true))
  await viewer.addPlugin(GammaCorrectionPlugin)
  await viewer.addPlugin(SSRPlugin)
  await viewer.addPlugin(SSAOPlugin)
  await viewer.addPlugin(BloomPlugin)

  // Loader
  const importer = manager.importer as AssetImporter

  importer.addEventListener("onProgress", (ev) => {
      const progressRatio = (ev.loaded / ev.total)
      // console.log(progressRatio)
      document.querySelector('.progress')?.setAttribute('style', `transform: scaleX(${progressRatio})`)
  })

  importer.addEventListener("onLoad", (ev) => {
      gsap.to('.loader', {x: '100%', duration: 0.8, ease: 'power4.inOut', delay: 1, onComplete: () =>{
          document.body.style.overflowY = 'auto'
          lenis.start()

      }})
  })

  viewer.renderer.refreshPipeline()

  await manager.addFromPath("./assets/scene2.glb")



  viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

  if (isMobile){
      position.set(-3.5, -1.1, 5.5)
      target.set(-0.8, 1.55, -0.7)
      camera.setCameraOptions({ fov: 40 })
  }

  onUpdate()
  
  window.scrollTo(0,0)

  function setupScrollanimation(){

      const tl = gsap.timeline()

// FIRST SECTION
tl.to(position, {
  x: isMobile ? 0.0418627019 : -6.3704870411,
  y: isMobile ? 0.0202326985 : 0.3476209261,
  z: isMobile ? 7.1833229412 : 8.2687543968,
  scrollTrigger: {
    trigger: ".view",
    start: "top bottom",
    end: "top top",
    scrub: true,
    immediateRender: false
  },
  onUpdate: onUpdate
}).to(target, {
  x: isMobile ? -0.4745182352 : -0.5787707603,
  y: isMobile ? -0.1852581565 : 0.0490187597,
  z: isMobile ? 0.4694950004 : 3.4536311728,
  scrollTrigger: {
    trigger: ".view",
    start: "top bottom",
    end: "top top",
    scrub: true,
    immediateRender: false
  }
})
 // LAST SECTION
 .to(position, {
  x: isMobile ? 0.0418627019 : -0.342829813,
  y: isMobile ? 0.0202326985 : 0.1480815996,
  z: isMobile ? 7.1833229412 : 8.9495383738,
  scrollTrigger: {
    trigger: ".explore",
    start: "top bottom",
    end: "top top",
    scrub: true,
    immediateRender: false
  },
  onUpdate: onUpdate
}).to(target, {
  x: isMobile ? -0.4745182352 : -1.7696163949,
  y: isMobile ? -0.1852581565 : -0.0967027417,
  z: isMobile ? 0.4694950004 : 1.5592421678,
  scrollTrigger: {
    trigger: ".explore",
    start: "top bottom",
    end: "top top",
    scrub: true,
    immediateRender: false
  }
})
//more section
.to("#webgi-canvas", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".top-seller",
    start: "top bottom",
    end: "top top",
    scrub: true,
    immediateRender: false
  },
  onUpdate: onUpdate
});


    

     }

  setupScrollanimation()

  // WEBGI UPDATE
  let needsUpdate = true;

  function onUpdate() {
      needsUpdate = true;
      viewer.renderer.resetShadows()
      viewer.setDirty()
  }

  viewer.addEventListener('preFrame', () =>{
      if(needsUpdate){
          camera.positionTargetUpdated(true)
          needsUpdate = false
      }
  })

 // SCROLL TO TOP
 document.querySelectorAll('.button--footer')?.forEach(item => {
  item.addEventListener('click', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  })
})


 // KNOW MORE EVENT
 const _a = document.querySelector('.button--hero');
 _a === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
   var element = document.querySelector('.second');
   window.scrollTo({
     top: element === null || element === void 0 ? void 0 : element.getBoundingClientRect().top,
     left: 0,
     behavior: 'smooth'
   });
 });

}

setupViewer()