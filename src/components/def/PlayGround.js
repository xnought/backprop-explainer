/* 
	Donny Bertucci: @xnought
	Summary: 
		Neural Network component that is what the user interacts with
*/
import React, { Component } from "react";
import * as d3 from "d3";
import Legend from "./Legend";
import "./d3.css";

class PlayGround extends Component {
	constructor(props) {
		super(props);
		this.state = {
			widths: 32,
			zoom: 15,
			macro: false,
			micro: false,
		};
		this.zoom = this.zoom.bind(this);
	}
	zoom(d3node, d3zoom, x, y, scaleZoom, duration) {
		d3node
			//.transition()
			//.duration(duration)
			//.ease(d3zoom)
			.attr(
				"transform",
				`translate(${-x * scaleZoom}, ${
					-y * scaleZoom
				})scale(${scaleZoom})`
			);
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

	render() {
		let model = [];
		if (this.props.mode) {
			const { trans } = this.props;

			//console.log(trans);
			model = this.flatten(trans.model);
			/* Now create array of output values from each neuron */
		}
		const { children } = this.props;

		let l = this.props.weights.length;
		const negWeight = "#D62839";
		const posWeight = "#4BA3C3";

		const link = d3
			.linkHorizontal()
			.x((d) => d.x)
			.y((d) => d.y);
		const playing = (
			<svg id="p" width="800" height="500" overflow="visible">
				<g transform={"scale(1)"}>
					<path
						d="M 750, 234 L 750, 300"
						stroke={l != 0 ? "#F50257" : "#ededed"}
						className={this.props.playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 315 },
							target: { x: 880, y: 430 },
						})}
						stroke={l != 0 ? "#F50257" : "#ededed"}
						fill="none"
						className={this.props.playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 250 },
							target: { x: 880, y: 150 },
						})}
						stroke={l != 0 ? "#F50257" : "#ededed"}
						fill="none"
						className={this.props.playing}
					></path>
					{this.props.links.map((d, i) => (
						<path
							key={i}
							d={d}
							className={this.props.playing}
							strokeWidth={
								l === 0
									? 1
									: Math.pow(this.props.weights[i], 2) + 0.1
							}
							stroke={
								l !== 0
									? this.props.weights[i] > 0
										? posWeight
										: negWeight
									: "#ededed"
							}
							fill="none"
						></path>
					))}
					{this.props.rects.map((d, i) => (
						<rect
							key={i}
							x={d.x}
							y={d.y}
							width={this.state.widths}
							height={this.state.widths}
							onClick={() => {
								this.props.onClick();
							}}
							fill="lightgrey"
						></rect>
					))}

					<rect
						x={734}
						y={300}
						width={32}
						height={32}
						fill="none"
						stroke="black"
					></rect>
					<text fontSize="13px" x={738} y={318}>
						Loss
					</text>
				</g>
			</svg>
		);

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

		const notPlaying = (
			<svg id="pp" width="800" height="500">
				<g id="gpp">
					<path
						d="M 750, 234 L 750, 300"
						stroke="black"
						className={this.props.backward}
					></path>
					{this.props.rects.map((d, i) => (
						<g id="ggpp" key={i}>
							<rect
								x={d.x}
								y={d.y}
								width={this.state.widths}
								height={this.state.widths}
								onClick={() => {
									//console.log(model[i]);
									console.log(d);
									const svgGroup = d3
										.select("#pp")
										.select("g");
									this.zoom(
										svgGroup,
										d3.easeExpInOut,
										d.x - 16,
										d.y,
										this.state.zoom,
										1500
									);
									this.setState({ micro: true });
								}}
								fill="lightgrey"
							></rect>

							<text fill="blue" x={d.x + 32} y={d.y + 16}>
								{model.length !== 0 && i < this.props.nshow
									? i > 0
										? model[i - 1].output.toFixed(2)
										: this.props.input
									: ""}
							</text>
							<text fill="red" x={d.x - 40} y={d.y + 16}>
								{model.length !== 0 && i > this.props.bshow
									? i > 0
										? model[i - 1].dInputsSum.toFixed(2)
										: ""
									: ""}
							</text>
							{i > 0 && this.state.micro
								? graph(
										d.x + 2,
										d.y,
										model.length > 0 ? model[i - 1] : []
								  )
								: ""}
						</g>
					))}

					{this.props.links.map((d, i) => (
						<path
							key={i}
							d={d}
							className={this.props.backward}
							strokeWidth={
								Math.pow(this.props.weights[i], 2) + 0.05
							}
							stroke={
								this.props.weights.length !== 0
									? this.props.weights[i] > 0
										? posWeight
										: negWeight
									: "#ededed"
							}
							fill="none"
						></path>
					))}
					<rect
						x={734}
						y={300}
						width={32}
						height={32}
						fill="none"
						stroke="black"
					></rect>
					<text fontSize="13px" x={738} y={318}>
						Loss
					</text>
					<text x={734} y={350}>
						{this.props.mode && this.props.nshow > 18
							? this.props.trans.loss.output.toFixed(2)
							: ""}
					</text>
					<text x={734} y={295} fill="red">
						{this.props.mode &&
						this.props.bshow < Infinity &&
						this.props.bshow > 0
							? this.props.trans.loss.dInputs.toFixed(2)
							: ""}
					</text>
				</g>
			</svg>
		);
		return (
			<div id="nn">
				{children}
				{!this.props.mode ? playing : notPlaying}
				<Legend />
			</div>
		);
	}
}

export default PlayGround;
