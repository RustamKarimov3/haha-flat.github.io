import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js'

const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const cubeEnvLoader = new THREE.CubeTextureLoader();



// console.log(helmet)

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// light
const ambientLight = new THREE.AmbientLight('white', 3);

// Scene
const scene = new THREE.Scene()
scene.add(ambientLight);

// gltfLoader.load('models/rat/street_rat_2k.gltf', (gltf) => {

//     gltf.scene.scale.set(100, 100, 100);

//     // scene.add(gltf.scene)
//     // const items = [...gltf.scene.children];

//     // // scene.add(data.scene)

//     // items.forEach((_, index) => {
//     //     const item = gltf.scene.children[index].copy()
//     //     // item.scale.set(10, 10, 10)
//     //     scene.add(item)
//     // })
// })


const man =  await fbxLoader.loadAsync('models/Capoeira.fbx')

const mixer = new THREE.AnimationMixer(man)
const action = mixer.clipAction(man.animations[0])

man.scale.set(0.03,0.03, 0.03)
// man.position.set(-60, -47, 0)

man.rotateY(Math.PI)



// gui.add(man.position, 'y', -100, 100, 0.1)
// gui.add(man.position, 'x', -100, 100, 0.1)
// gui.add(man.position, 'z', -100, 100, 0.1)
scene.add(man)

// Enviroment map
const envMap = cubeEnvLoader.load([
    'environmentMaps/3/py.webp',
    'environmentMaps/3/px.webp',
    'environmentMaps/3/pz.webp',
    'environmentMaps/3/nx.webp',
    'environmentMaps/3/ny.webp',
    'environmentMaps/3/nz.webp',
], (cube) => {
    console.log(cube, scene)

    console.log(scene)
    // scene.background = cube
    // scene.add(cube)

})

scene.background = envMap;
scene.environment = envMap;
scene.environmentIntensity = 1;
scene.backgroundBlurriness = 0.01;
scene.backgroundIntensity = 1;


gui.add(scene, 'environmentIntensity', 0, 100, 1)
gui.add(scene, 'backgroundBlurriness', 0, 1, 0.001)
gui.add(scene, 'backgroundIntensity', 0, 1, 0.001)

/**
 * Torus Knot
 */
// const torusKnot = new THREE.Mesh(
//     new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
//     new THREE.MeshStandardMaterial({color: 'grey', metalness: 1, roughness: 0.3})
// )
// torusKnot.position.y = 4
// torusKnot.position.x = -4

// scene.add(torusKnot)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.set(0, 7, -24)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Music

const button = window.document.createElement('button');

button.id = 'play';
button.style.position = 'fixed'
button.style.top = '50%'
button.style.left = '50%'
button.style.transform = 'translate(-50%, -50%)'
button.style.zIndex = '10'
button.textContent = 'Потанцевать хочию за русь, нажми';
document.body.appendChild(button);

const listener = new THREE.AudioListener();
camera.add( listener );
// create a global audio source
const sound = new THREE.Audio( listener );
// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load('sample.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );


    window.addEventListener('click', () => {
        if (!sound.isPlaying && sound.buffer) {
            action.play()
            sound.play();
            button.remove()
        }
    }, { once: true })
});





/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (mixer) {

        mixer.update(deltaTime)


         man.rotation.y += sound.isPlaying? 0.03: 0.01

    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()