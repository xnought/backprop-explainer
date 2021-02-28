/* 
	Donny Bertucci: @xnought
	Summary: 
		Neural Network component that is what the user interacts with
*/
import React, { Component } from "react";
import * as d3 from "d3";
import "./d3.css";
import { svg } from "d3";

class PlayGround extends Component {
	constructor(props) {
		super(props);
		this.state = {
			widths: 32,
			zoom: 15,
		};
		this.zoom = this.zoom.bind(this);
	}
	zoom(d3node, d3zoom, x, y, scaleZoom, duration) {
		d3node
			.transition()
			.duration(duration)
			.ease(d3zoom)
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
			console.log(this.props.trans);
			const { trans } = this.props;

			model = this.flatten(trans.model);
			/* Now create array of output values from each neuron */
		}
		const { children } = this.props;

		let l = this.props.weights.length;
		const playing = (
			<svg id="pp" width="800" height="600">
				<g transform={"scale(1)"}>
					{this.props.links.map((d, i) => (
						<path
							key={i}
							d={d}
							className={this.props.playing}
							strokeWidth={
								l === 0
									? 1
									: Math.pow(this.props.weights[i], 2) + 0.25
							}
							stroke={
								l !== 0
									? this.props.weights[i] > 0
										? "#8b0de5"
										: "#F50257"
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
				</g>
			</svg>
		);

		//Lets create the computational graph
		let fontSize = "1px";
		let a = [];
		let inc = 3;
		for (let i = 0; i < 8; i++) {
			a.push(i * 3.5);
		}

		const lin = d3.line();
		const p1 = [
			[3, 0.5],
			[8, 0.5],
		];
		const p2 = [
			[3, 3],
			[8, 3],
		];

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

		const graph = (x, y) => (
			<svg width={32} height={32} x={x} y={y}>
				{a.map((d, i) => (
					<g key={i}>
						<svg width={10} height={4} x={0} y={d}>
							<text fontSize={fontSize} x={0} y={1}>
								x
							</text>
							<text fontSize={fontSize} x={0} y={2.5}>
								w
							</text>
							{connection([6, 1.5], [10, 1.5], "black")}
							{inputWeightComponent(1, 1, 1, 1)}
						</svg>
						{connection([10, d + 1.5], [18.25, 16], "black")}
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
			<svg id="pp" width="1000" height="800">
				<g>
					{this.props.links.map((d, i) => (
						<path
							key={i}
							d={d}
							className={this.props.playing}
							strokeWidth={
								Math.pow(this.props.weights[i], 2) + 0.25
							}
							stroke={
								this.props.weights.length !== 0
									? this.props.weights[i] > 0
										? "#8b0de5"
										: "#F50257"
									: "#ededed"
							}
							fill="none"
						></path>
					))}
					{this.props.rects.map((d, i) => (
						<g key={i}>
							<text x={d.x + 35} y={d.y + 16}>
								{model.length !== 0
									? i > 0
										? model[i - 1].output
										: this.props.input
									: ""}
							</text>
							<rect
								x={d.x}
								y={d.y}
								width={this.state.widths}
								height={this.state.widths}
								onClick={() => {
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
										1000
									);
								}}
								fill="lightgrey"
							></rect>
						</g>
					))}
					<g>
						<text x={734} y={300}>
							Loss
						</text>
						<rect width={32} height={32} x={734} y={300}></rect>
						{graph(211, 24)}
					</g>
				</g>
			</svg>
		);
		return (
			<div id="nn">
				{children}
				{!this.props.mode ? playing : notPlaying}
			</div>
		);
	}
}

export default PlayGround;
