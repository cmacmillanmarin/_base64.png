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
	PlaneGeometry
} from 'three'

import OrbitControls from '../local_modules/OrbitControls.js'

import './style/main.css'

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const loader = new TextureLoader()
const img = loader.load('./src/images/gorillaz.png', (img) => {
	const imgWidth = 10
	const plane = new Mesh(new PlaneGeometry(imgWidth, imgWidth*img.image.height/img.image.width), img)
	plane.overdraw = true
	scene.add(plane)
})

camera.position.set(0, 0, 5)

const controls = new OrbitControls(camera, new Vector3(0, 0, 0))

function render(){

	requestAnimationFrame(render)

	controls.update()
	renderer.render(scene, camera)

}

render()
