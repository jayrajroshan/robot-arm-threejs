import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const base = new THREE.BoxGeometry( 20, 10, 20 );
const base_cyl = new THREE.CylinderGeometry( 3, 3, 6, 32 );
const hand_1 = new THREE.BoxGeometry( 5, 30, 5 );
const mid_cyl = new THREE.CylinderGeometry( 3, 3, 6, 32 );
const hand_2 = new THREE.BoxGeometry( 5, 30, 5 );
const hand_ball = new THREE.CylinderGeometry( 2.5, 2.5, 4, 32 );

// Materials

const material = new THREE.MeshLambertMaterial()
material.color = new THREE.Color(0x696969)

// Mesh
const cube = new THREE.Mesh( base, material );
        
        //First Hand Segment
const cylinder_bottom = new THREE.Mesh( base_cyl, material );
cylinder_bottom.position.set(0,6,0)
cylinder_bottom.rotation.x = Math.PI / 2;
cylinder_bottom.rotation.z = Math.PI / 2;

const hand_first = new THREE.Mesh( hand_1, material );
hand_first.position.set(0,20,0)

        //Second Hand Segment
const pivot = new THREE.Group();
pivot.position.set( 0, 35, 0 );
scene.add( pivot );

const cylinder_middle = new THREE.Mesh( mid_cyl, material );
cylinder_middle.rotation.x = Math.PI / 2;
cylinder_middle.rotation.z = Math.PI / 2;

const hand_second = new THREE.Mesh( hand_2, material );
hand_second.position.set(0,15,0)

const hand_end = new THREE.Mesh(hand_ball, material)
hand_end.position.set(0,32,0)

        //Creating different groups of Meshes
const robot_base = new THREE.Group();
const robot_full = new THREE.Group();
const robot_mid = new THREE.Group();

        //Placing Each Mesh in a Group
robot_mid.add( cylinder_middle )
robot_mid.add( hand_second )
robot_mid.add( hand_end )
robot_mid.rotateX(1)
pivot.add(robot_mid)

robot_full.add( pivot )
robot_full.add( cylinder_bottom )
robot_full.add( hand_first )

robot_base.add(cube)
robot_base.add(robot_full)

scene.add(robot_base)

        //GUI for debug
gui.add(robot_base.rotation, 'y').min(-3.5).max(3.5).step(0.01).name("Base")
gui.add(robot_full.rotation, 'x').min(-1.5).max(1.5).step(0.01).name("cyl_bottom")
gui.add(robot_mid.rotation, 'x').min(-2.5).max(2.5).step(0.01).name("cyl_middle")

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight); 

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
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2, // left
    cameraWidth / 2, // right
    cameraHeight / 2, // top
    cameraHeight / -2, // bottom
    0, // near plane
    1000 // far plane
  );
  camera.position.set(200, 200, 200);
  camera.lookAt(0, 15, 0);

// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 0
// camera.position.y = 0
// camera.position.z = 2
// scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //cube.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()