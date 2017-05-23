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
	ImageUtils,
	Geometry,
	Points,
	PointsMaterial,
	Color
} from 'three'

import OrbitControls from '../local_modules/OrbitControls.js'

import './style/main.css'





// IMAGE
const imagePath = './src/images/nba.jpg'

// WHAT YOU WANNA DO?
const task = (true) ? 'scramble' : 'unscramble'

// WHAT YOU WANNA SEE
const see = (false) ? 'result' : 'original'

// KEYS
const pi = 3.1416
const e = 2.7183
const euler = 0.57721
const pythagoras = 1.4142
const fibonacci = 1.6180
const gravity = 9.8
const universe = 42
const faraday = 96.485
const wien = 4.791
const plank = 3.990

// SELECTED KEY
const key = plank

// CONSOLE STATUS
console.info('Scramble ' + imagePath + ' with key ' + key)





// THREE SCENE
const scene = new Scene()
const renderer = new WebGLRenderer()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
const controls = new OrbitControls(camera, new Vector3(0, 0, 0))

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.set(0, 0, 1200)

init()






// Init
function init() {
	render()
	const img = new Image()
  	img.src = imagePath
  	img.onload = function() {
		const originMatrix = getColorMatrix(img)
		const finalMatrix = (task === 'scramble') ? scrambleMatrix(originMatrix) : unscrambleMatrix(originMatrix)
		drawImage((see === 'result') ? finalMatrix : originMatrix , img.width/2, img.height/2)
	}
}

function getColorMatrix(img) {
	const matrix = []
    const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0, img.width, img.height)
	for (let i = 0; i < img.height; i++) {
		matrix.push([])
		for (let j = 0; j < img.width; j++) {
			const imageData = context.getImageData(j, i, 1, 1)
			const R = imageData.data[0]
			const G = imageData.data[1]
			const B = imageData.data[2]
			const A = imageData.data[3]
			matrix[i].push([R, G, B, A])
		}
	}
    return matrix
}

function scrambleMatrix(matrix) {
	const finalMatrix = []
	const realKey = parseInt(key * 10)
	for (let i = 0; i < matrix.length; i++) {
		finalMatrix.push([])
		for (let j = 0; j < matrix[i].length; j++) {
			const plus = (j % 2 === 0) ? -1 : 1
			const alpha = (j % 3 === 0) ? 1 : -1
			const R = getRGBValidValue(matrix[i][j][0], (realKey * plus))
			const G = getRGBValidValue(matrix[i][j][1], (realKey * plus))
			const B = getRGBValidValue(matrix[i][j][2], (realKey * plus))
			const A = (alpha === 1) ? 0 : 255
			finalMatrix[i].push([R, G, B, A])
		}
	}
	return finalMatrix
}

// data texture con rgbs y meterlo a un shader material

function getRGBValidValue(val, key) {
	let finalVal
	if (key < 0) {
		if (val + key < 0) finalVal = 255 + val + key
		else finalVal = val + key
	} else {
		if (val + key > 255) finalVal = val + key - 255
		else finalVal = val + key
	}
	return finalVal
}

function drawImage(matrix, initX, initY) {
	let x = 0
	let y = 0
	for (let i = 0; i < matrix.length; i++) {
		y = -initY + i
		for (let j = 0; j < matrix[i].length; j++) {
			x = -initX + j
			if (j % 5 === 0)scene.add(newDot(matrix[i][j][0], matrix[i][j][1], matrix[i][j][2], new Vector3(x, y, 0)))
		}
	}
}

function newDot(r, g, b, pos) {
	const dotGeometry = new Geometry()
	dotGeometry.vertices.push(pos)
	const dotMaterial = new PointsMaterial( { size: 1, sizeAttenuation: false, color: new Color(rgbToHex(r, g, b)) } );
	const dot = new Points( dotGeometry, dotMaterial )
	return dot

}

function componentToHex(c) {
    var hex = c.toString(16)
    return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r, g, b) {
    return parseInt("0x" + componentToHex(r) + componentToHex(g) + componentToHex(b))
}

function unscrambleMatrix() {
	return 0
}

// Render

function render() {
	requestAnimationFrame(render)
	controls.update()
	renderer.render(scene, camera)
}
