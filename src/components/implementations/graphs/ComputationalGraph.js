import React, { Component } from "react";
class ComputationalGraph extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		//Lets create the computational graph
		let fontSize = "1px";
		const lin = d3.line();

		const mult = (x, y) => (
			<svg x={x} y={y} width={2} height={2}>
				<rect width={2} height={2} x={0} y={0} fill="white"></rect>
				<text fontSize="2px" x={0.5} y={2}>
					*
				</text>
			</svg>
		);
		const connection = (x, y, color) => (
			<path d={lin([x, y])} stroke={color} strokeWidth="0.1"></path>
		);

		const inputWeightComponent = (input, weight, dInput, dWeight) => (
			<g>
				{connection([1, 0.75], [4, 0.75], "black")}
				{connection([1, 2.25], [4, 2.25], "black")}
				{connection([4, 0.75], [6, 1.5], "black")}
				{connection([4, 2.25], [6, 1.5], "black")}
				{mult(5, 0.5)}
			</g>
		);

		const add = (x, y) => (
			<svg x={x} y={y} width={2} height={2}>
				<rect width={2} height={2} x={0} y={0} fill="white"></rect>
				<text fontSize="2px" x={0.5} y={1.5}>
					+
				</text>
			</svg>
		);
		const relu = (x, y) => (
			<svg x={x} y={y} width={2} height={2}>
				<rect width={2} height={2} x={0} y={0} fill="white"></rect>
				<text fontSize="0.5px" x={0.25} y={0.5}>
					ReLU
				</text>
				{connection([0, 1.5], [1, 1.5], "black")}
				{connection([1, 1.5], [2, 0.5], "black")}
			</svg>
		);

		const graph = (x, y, neuron) => (
			<svg width={32} height={32} x={x} y={y}>
				{neuron.length == 0
					? ""
					: neuron.inputs.map((d, i) => (
							<g key={i}>
								<svg width={10} height={4} x={0} y={i * 3.5}>
									<text fontSize={fontSize} x={0} y={1}>
										x
									</text>
									<text fontSize={"0.5px"} x={0.5} y={1.2}>
										{i}
									</text>
									<text fontSize={fontSize} x={0} y={2.5}>
										w
									</text>
									<text fontSize={"0.5px"} x={0.6} y={2.7}>
										{i}
									</text>
									{connection([6, 1.5], [10, 1.5], "black")}
									{inputWeightComponent(1, 1, 1, 1)}
								</svg>
								{connection(
									[10, i * 3.5 + 1.5],
									[18.25, 16],
									"black"
								)}
								{neuron.inputs.map((d, i) => (
									<text
										fontSize={"0.75px"}
										fill="blue"
										x={1}
										y={0.7 + 3.5 * i}
									>
										{d.toFixed(4)}
									</text>
								))}
								{neuron.dInputs.map((d, i) => (
									<text
										fontSize={"0.75px"}
										fill="red"
										x={1}
										y={1.4 + 3.5 * i}
									>
										{d.toFixed(4)}
									</text>
								))}

								{neuron.weights.map((d, i) => (
									<text
										fontSize={"0.75px"}
										fill="blue"
										x={1}
										y={2.2 + 3.5 * i}
									>
										{d.toFixed(4)}
									</text>
								))}
								{neuron.dWeights.map((d, i) => (
									<text
										fontSize={"0.75px"}
										fill="red"
										x={1}
										y={2.9 + 3.5 * i}
									>
										{d.toFixed(4)}
									</text>
								))}

								<text
									fontSize={"0.75px"}
									fill="blue"
									x={1}
									y={29.7}
								>
									{neuron.bias.toFixed(4)}
								</text>
								<text
									fontSize={"0.75px"}
									fill="red"
									x={1}
									y={30.4}
								>
									{neuron.dBias.toFixed(4)}
								</text>
								{neuron.multStep.map((d, i) => (
									<text
										fontSize={"0.75px"}
										fill="blue"
										x={7.25}
										y={1.4 + 3.5 * i}
									>
										{d.toFixed(4)}
									</text>
								))}
								{neuron.dSumStep.map((d, i) => (
									<text
										fontSize={"0.75px"}
										fill="red"
										x={7.25}
										y={2.1 + 3.5 * i}
									>
										{d.toFixed(4)}
									</text>
								))}

								<text
									fontSize={"0.75px"}
									fill="blue"
									x={20.1}
									y={16}
								>
									{neuron.sumStep.toFixed(4)}
								</text>
								<text
									fontSize={"0.75px"}
									fill="red"
									x={20.1}
									y={16.7}
								>
									{neuron.dActStep.toFixed(4)}
								</text>
								<text
									fontSize={"0.75px"}
									fill="blue"
									x={26.2}
									y={16}
								>
									{neuron.actStep.toFixed(4)}
								</text>
								<text
									fontSize={"0.75px"}
									fill="red"
									x={26.2}
									y={16.7}
								>
									{neuron.dvalue.toFixed(4)}
								</text>
							</g>
					  ))}

				<text fontSize={fontSize} x={0} y={30}>
					b
				</text>
				{connection([0.75, 29.75], [10, 29.75], "black")}
				{connection([10, 29.75], [18.25, 16], "black")}

				{connection([19, 16], [30, 16], "black")}
				{add(18, 15)}
				{relu(24, 15)}
			</svg>
		);
		return <div></div>;
	}
}
export default ComputationalGraph;
