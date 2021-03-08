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
		const { playing, weights, mode, links, rects } = this.props;
		const link = d3
			.linkHorizontal()
			.x((d) => d.x)
			.y((d) => d.y);
		const negWeight = "#D62839";
		const posWeight = "#4BA3C3";
		const squareWidth = 32;
		let model = [];
		if (mode) {
			const { miniNN } = this.props;
			//console.log(miniNN);
			model = this.flatten(miniNN.model);
			/* Now create array of output values from each neuron */
		}
		let l = weights.length;

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

		const nn = (
			<svg id="p" width="810" height="500" overflow="visible">
				<g>
					<path
						d="M 750, 234 L 750, 300"
						stroke={l != 0 ? "black" : "#ededed"}
						className={playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 315 },
							target: { x: 890, y: 430 },
						})}
						stroke={l != 0 ? "black" : "#ededed"}
						fill="none"
						className={playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 250 },
							target: { x: 890, y: 150 },
						})}
						stroke={l != 0 ? "black" : "#ededed"}
						fill="none"
						className={playing}
					></path>
					{links.map((d, i) => (
						<path
							key={i}
							d={d}
							className={playing}
							strokeWidth={
								l === 0 ? 1 : Math.pow(weights[i], 2) + 0.1
							}
							stroke={
								l !== 0
									? weights[i] > 0
										? posWeight
										: negWeight
									: "#ededed"
							}
							fill="none"
						></path>
					))}
					{rects.map((d, i) => (
						<g>
							<rect
								key={i}
								x={d.x}
								y={d.y}
								width={squareWidth}
								height={squareWidth}
								fill="lightgrey"
							></rect>
							{model.length !== 0 && mode
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
						</g>
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
		return (
			<div id="nn">
				{nn}
				<Legend />
			</div>
		);
	}
}

export default NeuralNetworkComponent;
