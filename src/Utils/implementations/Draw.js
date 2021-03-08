import * as d3 from "d3";

export function generateLinearScale(x, y) {
	const xScale = d3.scaleLinear().domain(x.domain).range(x.range);
	const yScale = d3.scaleLinear().domain(y.domain).range(y.range);
	return { xScale, yScale };
}

export function generateLink(adjustment) {
	return d3
		.linkHorizontal()
		.x((d) => d.x + adjustment)
		.y((d) => d.y + adjustment);
}

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
	let flattenedNeurons = [];
	shapedNeurons.push([startNeuron]);
	flattenedNeurons.push(startNeuron);

	for (let layer = 1; layer < shape.length - 1; layer++) {
		let dense = [];
		for (let neuron = 0; neuron < shape[layer]; neuron++) {
			const coordinate = {
				x: xScale(layerProportion[layer]) - squareWidth / 2,
				y: yScale(92 - neuron * 12) - squareWidth / 2,
			};
			// push to arrays
			dense.push(coordinate);
			flattenedNeurons.push(coordinate);
		}
		shapedNeurons.push(dense);
	}

	flattenedNeurons.push(stopNeuron);
	shapedNeurons.push([stopNeuron]);

	return { flattenedNeurons, shapedNeurons };
}
export function generateLinksPlacement(shape, shapedNeurons, linksGenerator) {
	/* We start to iterate over ns */
	let links = [];
	for (let layer = shape.length - 1; layer > 0; layer--) {
		//prettier-ignore
		for (
				let prevNeuron = 0;
				prevNeuron < shape[layer - 1];
				prevNeuron++
			) {
				for (let neuron = 0; neuron < shape[layer]; neuron++) {
					links.push(
						linksGenerator({
							source: shapedNeurons[layer - 1][prevNeuron],
							target: shapedNeurons[layer][neuron],
						})
					);
				}
			}
	}
	return links;
}
