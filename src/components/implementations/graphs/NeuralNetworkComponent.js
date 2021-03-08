import React, { Component } from "react";
import * as d3 from "d3";
import Legend from "../svg/Legend";
import Arrow from "../svg/Arrow";
import "../d3.css";

class NeuralNetworkComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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
		const negWeight = "#D62839";
		const posWeight = "#4BA3C3";
		const squareWidth = 32;

		let model = [];
		if (this.props.mode) {
			const { miniNN } = this.props;
			//console.log(miniNN);
			model = this.flatten(miniNN.model);
			/* Now create array of output values from each neuron */
		}
		const { children } = this.props;

		let l = this.props.weights.length;

		const link = d3
			.linkHorizontal()
			.x((d) => d.x)
			.y((d) => d.y);
		const playing = (
			<svg id="p" width="810" height="500" overflow="visible">
				<g>
					<path
						d="M 750, 234 L 750, 300"
						stroke={l != 0 ? "black" : "#ededed"}
						className={this.props.playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 315 },
							target: { x: 890, y: 430 },
						})}
						stroke={l != 0 ? "black" : "#ededed"}
						fill="none"
						className={this.props.playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 250 },
							target: { x: 890, y: 150 },
						})}
						stroke={l != 0 ? "black" : "#ededed"}
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
							width={squareWidth}
							height={squareWidth}
							onClick={() => {
								this.props.onClick();
							}}
							fill="lightgrey"
						></rect>
					))}

					<rect
						x={734}
						y={300}
						width={squareWidth}
						height={squareWidth}
						fill="none"
						stroke="black"
					></rect>
					<text
						fontFamily="sans-serif"
						fontSize="12px"
						x={739}
						y={318}
					>
						loss
					</text>
				</g>
			</svg>
		);

		const VerticalArrow = (xStart, yStart, length, dirIsUp, color) => {
			const vector = dirIsUp ? -length : length;
			return (
				<Arrow
					source={{ x: xStart, y: yStart }}
					target={{ x: xStart, y: yStart + vector }}
					color={color}
				/>
			);
		};
		const notPlaying = (
			<svg id="pp" width="810" height="500">
				<g id="gpp">
					<path
						d="M 750, 234 L 750, 300"
						stroke="black"
						className={this.props.backward}
					></path>

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

					{this.props.rects.map((d, i) => (
						<g id="ggpp" key={i}>
							<rect
								x={d.x}
								y={d.y}
								width={squareWidth}
								height={squareWidth}
								fill="lightgrey"
							></rect>
							{model.length !== 0
								? i > 0
									? VerticalArrow(
											d.x + 16,
											d.y + 16,
											Math.abs(
												1.2 * model[i - 1].dActStep
											),
											model[i - 1].dActStep < 0,
											"grey"
									  )
									: ""
								: ""}
							<text fill="#8db600" x={d.x + 34} y={d.y + 12}>
								{model.length !== 0
									? i > 0
										? model[i - 1].output.toFixed(2)
										: this.props.input
									: ""}
							</text>
							<text fill="#F50657" x={d.x + 34} y={d.y + 28}>
								{model.length !== 0
									? i > 0
										? model[i - 1].dActStep.toPrecision(3)
										: ""
									: ""}
							</text>
						</g>
					))}
					<rect
						x={734}
						y={300}
						width={32}
						height={32}
						fill="none"
						stroke="black"
					></rect>
					<text
						fontFamily="sans-serif"
						fontSize="13px"
						x={738}
						y={318}
					>
						Loss
					</text>
					<text x={734} y={350}>
						{this.props.mode
							? this.props.miniNN.loss.output.toPrecision(3)
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

export default NeuralNetworkComponent;
