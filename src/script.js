import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader();
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
const ambientLight = new THREE.AmbientLight('white', 10);

// Scene
const scene = new THREE.Scene()
// scene.add(ambientLight);

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {

    gltf.scene.scale.set(10, 10, 10);

    scene.add(gltf.scene)
    // const items = [...gltf.scene.children];

    // // scene.add(data.scene)

    // items.forEach((_, index) => {
    //     const item = gltf.scene.children[index].copy()
    //     // item.scale.set(10, 10, 10)
    //     scene.add(item)
    // })
})

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
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({color: 'grey', metalness: 1, roughness: 0.3})
)
torusKnot.position.y = 4
torusKnot.position.x = -4

scene.add(torusKnot)

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

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()