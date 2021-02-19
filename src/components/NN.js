import react, { Component } from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import style from "./d3.css";
import * as d3 from "d3";
class NN extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.initNeuralNetwork = this.initNeuralNetwork.bind(this);
	}
	initNeuralNetwork(node) {
		const { playing, shape, weights, slowed } = this.props;
		const rw = 32;
		const rh = 32;
		const svg = node;

		let xScale = d3.scaleLinear().domain([0, 100]).range([50, 750]);

		let yScale = d3.scaleLinear().domain([0, 100]).range([500, 0]);

		let start = { x: 50 - rw / 2, y: 250 - rh / 2 };
		let stop = { x: 750 - rw / 2, y: 250 - rh / 2 };

		const link = d3
			.linkHorizontal()
			.x((d) => d.x + rw / 2)
			.y((d) => d.y + rh / 2);

		/* First we figure our how to create the neurons */
		/* GIVEN A SHAPE OF [1,2,2,1] */
		const layerProportion = [0, 25, 50, 75, 0];
		let ns = [];
		let flatns = [];
		ns.push([start]);
		flatns.push(start);
		for (let layer = 1; layer < shape.length - 1; layer++) {
			let dense = [];
			for (let neuron = 0; neuron < shape[layer]; neuron++) {
				/* First generate neuron */
				let aaron = {
					x: xScale(layerProportion[layer]) - rw / 2,
					y: yScale(92 - neuron * 12) - rh / 2,
				};
				dense.push(aaron);
				flatns.push(aaron);
			}
			ns.push(dense);
		}
		flatns.push(stop);
		ns.push([stop]);

		/* We start to iterate over ns */
		let links = [];
		for (let layer = shape.length - 1; layer > 0; layer--) {
			for (
				let prevNeuron = 0;
				prevNeuron < shape[layer - 1];
				prevNeuron++
			) {
				for (let neuron = 0; neuron < shape[layer]; neuron++) {
					links.push(
						link({
							source: ns[layer - 1][prevNeuron],
							target: ns[layer][neuron],
						})
					);
				}
			}
		}
		let flattenedWeights = this.flatten(weights);

		svg.selectAll("path")
			.data(links)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("class", "edgeForward")
			.attr("stroke-width", "0.5")
			.attr("d", (d) => d);
		svg.selectAll("path")
			.data(flattenedWeights)
			.attr("stroke-width", (d) => Math.pow(d, 2) + 0.2);

		svg.selectAll("rect")
			.data(flatns)
			.enter()
			.append("rect")
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("width", rw)
			.attr("height", rh)
			.attr("class", "node");

		if (!playing) {
			svg.selectAll("path").attr("class", "edgePaused");
		} else if (playing) {
			svg.selectAll("path").attr(
				"class",
				slowed ? "edgeSlowed" : "edgeForward"
			);
		}
	}
	componentDidMount() {
		const height = 500;
		const width = 800;
		const svg = d3
			.select("#nn")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("overflow", "visible");
		//svg.append("circle").attr("r", 1000);

		this.initNeuralNetwork(svg);
	}
	flatten(array) {
		let flattendArray = [];
		for (let i = 0; i < array.length; i++) {
			for (let e = 0; e < array[i].length; e++) {
				flattendArray.push(array[i][e]);
			}
		}
		return flattendArray;
	}
	revereseFlatten(array) {
		let flattendArray = [];
		for (let i = array.length - 1; i >= 0; i--) {
			for (let e = 0; e < array[i].length; e++) {
				flattendArray.push(array[i][e]);
			}
		}
		return flattendArray;
	}
	perNeuron(weights, shape) {
		let weightModel = [];
		if (weights.length > 0) {
			let flattenedWeights = this.revereseFlatten(weights);
			console.log(flattenedWeights);
			console.log(weights);
			let weightsIndex = 0;
			/* Iterate but not the input node */
			/*  this is an ass algo fix this you idiot  */
			for (let layer = shape.length - 1; layer > 0; layer--) {
				/* Now we want to assign the weight based on number of inputs */
				let dense = [];
				for (let neuron = 0; neuron < shape[layer]; neuron++) {
					let connections = shape[layer - 1];
					let connectionArray = [];
					for (let w = 0; w < connections; w++) {
						connectionArray.push(flattenedWeights[weightsIndex]);
						weightsIndex++;
					}
					dense.push(connectionArray);
				}
				weightModel.push(dense);
			}
		}
		return weightModel.reverse();
	}
	componentDidUpdate() {
		const svg = d3.select("#nn").select("svg");
		this.initNeuralNetwork(svg);

		/* If there is a change to shape do these things */
		/* First need to create a function to places all of the neurons */
		/* then need to create a function to that links all of the neurons with stroke */

		/* If there is no change to shape then we just need to change the link stroke */
	}
	render() {
		const { children } = this.props;
		return (
			<div id="nn">
				<AppBar
					position="static"
					style={{ background: "white", color: "white" }}
				></AppBar>
			</div>
		);
	}
}

export default NN;
