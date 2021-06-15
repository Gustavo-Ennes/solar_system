import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { Text } from 'troika-three-text';
import tweenElement from './tween.js';
import universeJSON from './shaders/universe/universe.js'
import sunJSON from './shaders/sun/sun.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


const EARTH_SIZE = 0.12756 // 0.1 === 10000km
const EARTH_ROTATION = 0.0004736
const EARTH_VELOCITY = 1.07278
const SUN_RADIUS = EARTH_SIZE * 109
const INITIAL_POS = {x: 2* SUN_RADIUS, y:-10*SUN_RADIUS, z:SUN_RADIUS *2}
const MODEL_LOADER = new GLTFLoader()


// console.log(`sun uniforms:\n${JSON.stringify(sunJSON.uniforms, null, 2)}`)
// console.log(`universe uniforms:\n${JSON.stringify(universeJSON.uniforms, null, 2)}`)


let star = null 
let planets = [] 
let controls = null 
let clock = null 
let tweens = [] 
let lights = [] 
let camera = null 
let scene = null 
let renderer = null
let error = null
let loader = null

let uniforms = {
  universe: universeJSON.uniforms,
  sun: sunJSON.uniforms
}
let vertexShaders = {
  universe: universeJSON.vertex,
  sun: sunJSON.vertex
}
let fragmentShaders = {
  universe: universeJSON.fragment,
  sun: sunJSON.fragment
}

const chainTweens = () => {

  if(tweens.length > 1){
    for(let i = 0; i < tweens.length - 1; i++){
      tweens[i].tween.chain(tweens[i + 1].tween)
    }
    tweens[tweens.length - 1].tween.chain(tweens[0].tween)
  }
  if(tweens[0]){
    tweens[0].tween.delay(2000)
    tweens[0].tween.start()
  }
}

const comeBack = () => {

  try {
    const chain = tweenElement(
      {
        mesh: {
          position: star.position,
          vp: {x: 100, y: 100, z: planets[planets.length - 1].translateRadius * 1.2}
        }
      }, 
      controls.object.position, 
      controls, 
      3000,
      true
    )
    tweens.push({tween: chain, name: 'back'}) 
  } catch (err) {
    console.log(err)
    error = true
  }
}

const goto = (name, time=6000) => {

  let chain
  try {
    const el = (name === 'sun') ? 
              star : 
              (planets.filter(p => p.name === name)[0] || {})

    // const mesh = el.mesh || el
    chain = {
      tween: tweenElement(
        el, 
        controls.object.position, 
        controls, 
        time, 
        true
      ), 
      name: name
    }
    tweens.push(chain) 
  } catch (err) {
    console.log(err)
    error = true
  }
  return chain
}

const createModel = () => {
  MODEL_LOADER.load( './src/models/scene.gltf', function ( gltf ) {

    console.dir(gltf)
    const shipPos= {
      x: star.position.x - star.size * 2,
      y: star.position.y - star.size * 2,
      z: star.position.z - star.size * 2
    }

    gltf.scene.children[0].position.copy(shipPos)
    gltf.scene.children[0].scale.set(.1, .1, .1)

    scene.add( gltf.scene.children[0] );
  
  }, undefined, function ( error ) {
  
    console.error( error );
  
  } );
}

const init = () => {

  try{
    createScene();
    createStar();
    // createModel()

    //MERCURY
    createPlanet(
      0.4 * EARTH_SIZE, 
      'mercury', 
      EARTH_ROTATION / 400,
      SUN_RADIUS + 0.69811, 
      0.4*EARTH_VELOCITY, 
      'https://vignette.wikia.nocookie.net/planet-texture-maps/images/7/72/Mercury02.png/revision/latest/scale-to-width-down/660?cb=20180308212300'
    );
    // VENUS
    createPlanet(
      0.9 * EARTH_SIZE, 
      'venus', 
      EARTH_ROTATION / 2000,
      SUN_RADIUS + 1.07477, 
      2*(EARTH_VELOCITY / 3),
      'https://2.bp.blogspot.com/-DmSZFIVm7MI/UiVXAw4KdtI/AAAAAAAAAL0/VFwwzUqDzew/s1600/mercurymap.jpg'
    );
    //EARTH
    createPlanet(
      EARTH_SIZE, 
      'earth', 
      EARTH_ROTATION,
      SUN_RADIUS + 1.51873, 
      EARTH_VELOCITY,
      'https://graphics.latimes.com/static/img/earth_texture_map_1000px.jpg'
    );
    //MARS
    createPlanet(
      .5*EARTH_SIZE, 
      'mars', 
      EARTH_ROTATION,
      SUN_RADIUS + 2.48392, 
      EARTH_VELOCITY / 2,
      'https://i.stack.imgur.com/zz8Bv.jpg'

    );
    //JUPITER
    createPlanet(
      11.2*EARTH_SIZE, 
      'jupiter', 
      2.5*EARTH_ROTATION,
      SUN_RADIUS + 7.54721, 
      EARTH_VELOCITY / 12,
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/06a094a4-7bd7-4bb9-b998-6c1e17f66c08/db6cuqb-19a42dfd-b295-4331-8a34-e8dc8e9572f6.png/v1/fill/w_1024,h_512,q_75,strp/jupiter_true_color_texture_map___voyager_2_by_fargetanik-db6cuqb.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl0sIm9iaiI6W1t7InBhdGgiOiIvZi8wNmEwOTRhNC03YmQ3LTRiYjktYjk5OC02YzFlMTdmNjZjMDgvZGI2Y3VxYi0xOWE0MmRmZC1iMjk1LTQzMzEtOGEzNC1lOGRjOGU5NTcyZjYucG5nIiwid2lkdGgiOiI8PTEwMjQiLCJoZWlnaHQiOiI8PTUxMiJ9XV19.dgoDF3-C7mf8JNbTYWp4RQVvyoITILCYXD5oPsx3JF4',
    );
    //SATURN
    createPlanet(
      9.4*EARTH_SIZE, 
      'saturn', 
      EARTH_ROTATION / 2.5,
      SUN_RADIUS + 14.89992,
      EARTH_VELOCITY / 30,
      'https://vignette.wikia.nocookie.net/planet-texture-maps/images/6/61/Saturn.jpg/revision/latest?cb=20190416043829',
      'https://www.solarsystemscope.com/images/textures/preview/saturn_ring.jpg'
    );
    // URANUS
    createPlanet(
      4*EARTH_SIZE, 
      'uranus', 
      EARTH_ROTATION * 0.75,
      SUN_RADIUS + 29.54701, 
      EARTH_VELOCITY / 95,
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/90ad8232-4e09-4675-b9e7-bc2898960870/db7yjwb-b584de5b-6ea9-4a3c-b310-b980aa23041e.png/v1/fill/w_1024,h_512,q_80,strp/uranus_texture_map_by_jcpag2010_db7yjwb-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvOTBhZDgyMzItNGUwOS00Njc1LWI5ZTctYmMyODk4OTYwODcwXC9kYjd5andiLWI1ODRkZTViLTZlYTktNGEzYy1iMzEwLWI5ODBhYTIzMDQxZS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.RIHRrc5gYtsh6bbUOjjdZU-I2UlMZpVmF4Y58GpfJrw',
      'https://www.solarsystemscope.com/images/textures/preview/saturn_ring.jpg'
    );
    // NEPTUNE
    createPlanet(
      3.9*EARTH_SIZE, 
      'neptune', 
      EARTH_ROTATION * 0.8,
      SUN_RADIUS + 44.79586, 
      EARTH_VELOCITY / 190,
      'https://www.wisc-online.com/assetrepository/getfile?id=1907&getType=view&width=0&height=0'
    );

    createUniverse();
    
    addLight();

    cameraTour();

    animate();

    addEventListeners();

  } catch(err){
    console.log({err});
    error = true
  }
}

const createStar = () => {

  try{
    const geometry = new THREE.SphereGeometry(SUN_RADIUS, 50, 50) 
    
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms.sun,
      vertexShader: vertexShaders.sun,
      fragmentShader: fragmentShaders.sun
    })

    star = new THREE.Mesh(geometry, material)
    scene.add(star)  
  }catch(err){
    console.log(err)
    error = true
  }
}

const addLight = () => {

  const maxLightDistance = planets[planets.length - 1].translateRadius * 5
  const light1 = new THREE.PointLight(0xffeaea, 2, maxLightDistance, 2)
  lights.push(light1)
  scene.add(light1)
}

const createPlanet = (size, name, rotation, translateRadius, velocity, texture, ring=null) => {
  const planetGeometry = new THREE.SphereGeometry(size, 25, 25);
  const material = new THREE.MeshPhongMaterial({map: loader.load(texture)});
  const planet = new THREE.Mesh( planetGeometry, material );
  // const myText = new Text()
  
  let group = new THREE.Group();
  group.add(planet)

  if(ring){
    const ringMaterial = new THREE.MeshPhongMaterial({map: loader.load(ring), side: THREE.DoubleSide})
    const ringGeometry = new THREE.RingGeometry(2.2*size, 1.5*size, 80);
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)

    ringMesh.rotation.x = 180

    group.add(ringMesh)
    planets.push({
      mesh: group,
      size: size,
      vp: {},
      name: name,
      rotation: rotation,
      translateRadius: translateRadius,
      velocity: velocity
    });
    group.position.set(0, translateRadius, 0)
    group.vp = new THREE.Vector3(0, 0, translateRadius+(size*1.01))
    scene.add(group);

  }else{

    planets.push({
      mesh: group,
      size: size,
      vp:{},
      name: name,
      rotation: rotation,
      translateRadius: translateRadius,
      velocity: velocity
    })
    group.position.set(0, translateRadius, 0)
    group.vp = new THREE.Vector3(0, 0, translateRadius+(size*1.01))
    scene.add( group);
  }
}

const orbitCalculation = (radius, velocity=15) => {
  return {
    x: (Math.sin((Date.now()%60000)/60000 * Math.PI * velocity) * radius),
    z: (Math.cos((Date.now()%60000)/60000 * Math.PI * velocity) * radius)
  };
}

const animatePlanets = () => {

  for(let i = 0; i < planets.length; i++){
    const orbitPos = orbitCalculation(
      planets[i].translateRadius,
      planets[i].velocity
    )

    planets[i].mesh.position.set(
      orbitPos.x,
      0,
      orbitPos.z,
    )
    
    planets[i].vp = new THREE.Vector3(
      orbitPos.x, 
      -planets[i].size * 1.1,
      orbitPos.z
    )

    planets[i].mesh.rotation.y -= planets[i].rotation;
  }
}

const updateUniforms = () => {
  uniforms.sun.cameraPosition.value = new THREE.Vector3().copy(camera.position)
  uniforms.sun.time.value = clock.getElapsedTime()
  uniforms.universe.cameraPosition.value = new THREE.Vector3().copy(camera.position)
  uniforms.universe.time.value = clock.getElapsedTime()
}

const animate = () => {
  if(! error ){
    requestAnimationFrame(animate);

    controls.update()
    star.rotation.y -= 0.024;
    animatePlanets();
    TWEEN.update();
    updateUniforms();

    renderer.render(scene,  camera);
  }
}

const createUniverse = () => {

  const geo = new THREE.SphereGeometry(
    planets[ planets.length - 1].translateRadius * 5,
    55, 
    55
  )
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms.universe,
    vertexShader: vertexShaders.universe,
    fragmentShader: fragmentShaders.universe,
    side: THREE.DoubleSide
  })
  const mesh = new THREE.Mesh(geo, material)

  scene.add(mesh)
}

const createScene = () => {
  const loadManager = new THREE.LoadingManager();
  loader = new THREE.TextureLoader(loadManager);

  scene = new THREE.Scene()

  renderer = new THREE.WebGL1Renderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize( window.innerWidth, window.innerHeight);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.01,
    1000
  )
  camera.position.set(INITIAL_POS.x, INITIAL_POS.y, INITIAL_POS.z)

  controls = new OrbitControls( camera,  renderer.domElement)

  document.body.appendChild(  renderer.domElement );
  
  clock = new THREE.Clock()
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

const cameraTour = () => { 
  // goto('mercury')
  goto('venus' )
  // goto('earth')
  // goto('mars')
  // goto('jupiter')
  // goto('saturn')
  // goto('uranus')
  // goto('neptune')
  
  comeBack()      

  chainTweens()
}

const addEventListeners = ()=> {
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('click', () => {
    console.log(` cameraPos: ${JSON.stringify( camera.position)}`)
  })
}

init()