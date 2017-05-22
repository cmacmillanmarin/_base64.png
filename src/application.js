//
//	application.js

import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	BoxGeometry,
	MeshBasicMaterial,
	Mesh,
	Vector3,
	TextureLoader,
	PlaneGeometry,
	ImageUtils
} from 'three'

import OrbitControls from '../local_modules/OrbitControls.js'

import './style/main.css'

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new BoxGeometry(3, 3, 3)
const material = new MeshBasicMaterial({ color: 0xffffff })
const cube = new Mesh(geometry, material)

// 'actual'
const loader = new TextureLoader()
loader.crossOrigin = true
const plane = new Mesh(new PlaneGeometry(3, 3))
loader.load('./src/images/gorillaz.png', (img) => {
	plane.map = img
	plane.needsUpdate = true
	plane.position.set(-1.5,0,0)
})

scene.add(plane)

// DEPRECATED
const img2 = new MeshBasicMaterial({ map: ImageUtils.loadTexture('src/images/gorillaz.png') })
img2.map.needsUpdate = true

const plane2 = new Mesh(new PlaneGeometry(3, 3), img2)
plane2.overdraw = true
console.log(plane2.position)
plane2.position.set(1.5,0,0)
scene.add(plane2)


camera.position.set(0, 0, 5)

const controls = new OrbitControls(camera, new Vector3(0, 0, 0))

function render(){

	requestAnimationFrame(render)

	controls.update()
	renderer.render(scene, camera)

}

render()
