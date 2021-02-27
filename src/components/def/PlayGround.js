/* 
	Donny Bertucci: @xnought
	Summary: 
		Neural Network component that is what the user interacts with
*/
import React, { Component } from "react";
import * as d3 from "d3";
import "./d3.css";

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
