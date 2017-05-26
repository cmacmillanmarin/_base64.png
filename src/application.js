//
//	application.js

import './style/main.css'
import { ImageUtils } from 'three'

// Image and order hash
const base64Image = './src/images/img.png'
const base64OrderHash = 'Az9By8Cx7_Dw6Ev5Fu4Gt3+Hs2Ir1Jq0KpLoMnNmOlPkQjRiShTgUfVeWdXcYbZa'
const wrongHash = 'ABCDEFGHIJKLMNOPQRSTUVW0123456789+_XYZabcdefghijklmnopqrstuvwxyz'

// Variables
let imageWidth
let imageHeight
let columnsOrder
let rowsOrder
let realWrongHash

// Creates 3 Canvas
const originCanvas = document.createElement('canvas')
const scrambledCanvas = document.createElement('canvas')
const finalCanvas = document.createElement('canvas')
originCanvas.id = 'origin'
scrambledCanvas.id = 'scrambled'
finalCanvas.id = 'final'
document.body.appendChild(originCanvas)
document.body.appendChild(scrambledCanvas)
document.body.appendChild(finalCanvas)
const originCtx = originCanvas.getContext('2d')
const scrambledCtx = scrambledCanvas.getContext('2d')
const finalCtx = finalCanvas.getContext('2d')

// Creates a Button to download the scrambled Image
const button = document.createElement('a')
button.innerHTML = 'DOWNLOAD PHOTO'
button.download = 'scrambled-image.png'
document.body.appendChild(button)
button.addEventListener('click', downloadImage, false)

init()

// Init
function init() {
	const img = new Image()
  	img.src = base64Image
  	img.onload = function() {
		imageWidth = img.width
		imageHeight = img.height
		originCanvas.width = imageWidth
		originCanvas.height = imageHeight
		scrambledCanvas.width = imageWidth
		scrambledCanvas.height = imageHeight
		finalCanvas.width = imageWidth
		finalCanvas.height = imageHeight
		columnsOrder = decodeOrderHash(base64OrderHash, 0)
		rowsOrder = decodeOrderHash(base64OrderHash, 1)
		realWrongHash = decodeOrderHash(wrongHash)
		const originMatrix = getColorMatrixOf(img)
		const scrambledMatrix = scrambleMatrix(originMatrix, columnsOrder, rowsOrder)
		const finalMatrix = unScrambleMatrix(scrambledMatrix, columnsOrder, rowsOrder)
		drawImage(originMatrix, originCtx)
		drawImage(scrambledMatrix, scrambledCtx)
		drawImage(finalMatrix, finalCtx)
	}
}

// Returns a matrix with every pixel, RGBA mode, of an image
function getColorMatrixOf(img) {
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

// Scrambles a matrix
function scrambleMatrix(matrix, columnsOrder, rowsOrder) {
	let finalMatrix = scrambleColumns(matrix, columnsOrder)
	finalMatrix = scrambleColumns(finalMatrix, columnsOrder)
	finalMatrix = scrambleRows(finalMatrix, rowsOrder)
	finalMatrix = scrambleRows(finalMatrix, rowsOrder)
	return finalMatrix
}

// Scrambles the columns of a matrix with a concrete order
function scrambleColumns(matrix, order) {
	let auxMatrix = initMatrixFrom(matrix)
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++)
			for (let k = 0; k < 4; k++)
				auxMatrix[j][i][k] = matrix[j][order[i]][k]
	}
	return auxMatrix
}

// Scrambles the rows of a matrix with a concrete order
function scrambleRows(matrix, order) {
	let auxMatrix = []
	auxMatrix.length = matrix.length
	for (let i = 0; i < matrix.length; i++)
		auxMatrix[i] = matrix[order[i]]
	return auxMatrix
}

// unscrambles a matrix
function unScrambleMatrix(matrix, columnsOrder, rowsOrder) {
	let finalMatrix = unScrambleRows(matrix, rowsOrder)
	finalMatrix = unScrambleRows(finalMatrix, rowsOrder)
	finalMatrix = unScrambleColumns(finalMatrix, columnsOrder)
	finalMatrix = unScrambleColumns(finalMatrix, columnsOrder)
	return finalMatrix
}

// unscrambles the rows of a matrix with a concrete order
function unScrambleRows(matrix, order) {
	let auxMatrix = []
	auxMatrix.length = matrix.length
	for (let i = 0; i < matrix.length; i++)
		auxMatrix[order[i]] = matrix[i]
	return auxMatrix
}

// unscrambles the columns of a matrix with a concrete order
function unScrambleColumns(matrix, order) {
	let auxMatrix = initMatrixFrom(matrix)
	for (let i = 0; i < matrix.length; i++)
		for (let j = 0; j < matrix[i].length; j++)
			for (let k = 0; k < 4; k++)
				auxMatrix[j][order[i]][k] = matrix[j][i][k]
	return auxMatrix
}

// Draws an image from a color matrix in a concrete context
function drawImage(matrix, ctx) {
	let img = ctx.createImageData(imageWidth,	imageHeight)
	for (let i = 0; i < img.data.length; i = i + 4) {
		const row = parseInt((i / 4) / imageWidth)
		const column = parseInt(i / 4) - imageWidth * row
		img.data[i] = matrix[row][column][0]
		img.data[i + 1] = matrix[row][column][1]
		img.data[i + 2] = matrix[row][column][2]
		img.data[i + 3] = matrix[row][column][3]
	}
	ctx.putImageData(img, 0, 0)
}

// Decodes the order hash with a concrete orientation
function decodeOrderHash(hash, orientation) {
	let orderArray = []
	const auxHash = (orientation === 0) ? hash : invest(hash)
	const loops = parseInt(imageWidth/hash.length)
	for (let i = 0; i < loops; i++) {
		for (let j = 0; j < hash.length && orderArray.length < imageWidth; j++)
			orderArray.push(charToDec(auxHash[j]) + hash.length * i)
	}
	return orderArray
}

// Returns an integer from 0 to 63 depending on the char position
function charToDec(char) {
    return char.split('').reduce((result, ch) => result * 16 + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_'.indexOf(ch), 0)
}

// Invest the order of a hash
function invest(hash) {
	let auxHash = ''
	for (let i = 0; i < hash.length; i++) auxHash = auxHash + hash[(hash.length - 1) - i]
	return auxHash
}

// Initializes a matrix from another one
function initMatrixFrom(matrix) {
	let auxMatrix = []
	for (let i = 0; i < matrix.length; i++) {
		auxMatrix.push([])
		for (let j = 0; j < matrix[i].length; j++) {
			auxMatrix[i].push([0,0,0,0])
		}
	}
	return auxMatrix
}

// Downloads the scrambled image
function downloadImage() {
	let dataURL = scrambledCanvas.toDataURL('image/png')
	this.href = dataURL
}
