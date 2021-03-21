/* 
	Donny Bertucci: @xnought
	Summary: 
		This file generates the drawing parts of the nerual network
*/
import * as d3 from "d3";

/* 
	Generate d3 linear scales for x and y	
	@return {xScale, yScale}
*/
export function generateLinearScale(x, y) {
	const xScale = d3.scaleLinear().domain(x.domain).range(x.range);
	const yScale = d3.scaleLinear().domain(y.domain).range(y.range);
	return { xScale, yScale };
}

/* 
	Generate Bezier Curved Links
	@return d3 link
*/
export function generateLink(adjustment) {
	return d3
		.linkHorizontal()
		.x((d) => d.x + adjustment)
		.y((d) => d.y + adjustment);
}

/* 
	Generate the rectangles for neuron placement
	@return  shapedNeurons
*/
export function generateNeuronPlacement(
	shape,
	layerProportion,
	squareWidth,
	startNeuron,
	stopNeuron,
	xScale,
	yScale
) {
	let shapedNeurons = [];
	shapedNeurons.push([startNeuron]);

	for (let layer = 1; layer < shape.length - 1; layer++) {
		let dense = [];
		for (let neuron = 0; neuron < shape[layer]; neuron++) {
			const coordinate = {
				x: xScale(layerProportion[layer]) - squareWidth / 2,
				y: yScale(92 - neuron * 12) - squareWidth / 2,
			};
			// push to arrays
			dense.push(coordinate);
		}
		shapedNeurons.push(dense);
	}

	shapedNeurons.push([stopNeuron]);

	return shapedNeurons;
}

/* 
	Generate the placement of links relative to neurons
	@return layerLinks
*/
export function generateLinksPlacement(shape, shapedNeurons, linksGenerator) {
	/* We start to iterate over ns */
	let perLink = [];
	let layerLinks = [];
	let neuronLinks = [];
	for (let layer = 1; layer < shape.length; layer++) {
		neuronLinks = [];
		for (let neuron = 0; neuron < shape[layer]; neuron++) {
			perLink = [];
			for (
				let nextNeuron = 0;
				nextNeuron < shape[layer - 1];
				nextNeuron++
			) {
				perLink.push(
					linksGenerator({
						source: shapedNeurons[layer - 1][nextNeuron],
						target: shapedNeurons[layer][neuron],
					})
				);
			}
			neuronLinks.push(perLink);
		}
		layerLinks.push(neuronLinks);
	}

	return layerLinks;
}
