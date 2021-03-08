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
	isEmpty(array) {
		return array.length === 0;
	}
	isUndefined(val) {
		return typeof val === "undefined";
	}
	isUndefined3d(array3d, i, j, k) {
		return (
			this.isUndefined(array3d[i]) ||
			this.isUndefined(array3d[i][j]) ||
			this.isUndefined(array3d[i][j][k])
		);
	}

	render() {
		const {
			playing,
			mode,
			shapedLinks,
			shapedWeights,
			shapedRects,
			miniNN,
		} = this.props;
		const link = d3
			.linkHorizontal()
			.x((d) => d.x)
			.y((d) => d.y);
		const negWeight = "#D62839";
		const posWeight = "#4BA3C3";
		const graphConnectionColor = "black";
		const squareWidth = 32;

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
						stroke={graphConnectionColor}
						className={playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 315 },
							target: { x: 890, y: 430 },
						})}
						stroke={graphConnectionColor}
						fill="none"
						className={playing}
					></path>
					<path
						d={link({
							source: { x: 766, y: 250 },
							target: { x: 890, y: 150 },
						})}
						stroke={graphConnectionColor}
						fill="none"
						className={playing}
					></path>
					{shapedLinks.map((layer, i) =>
						layer.map((neuron, j) =>
							neuron.map((d, k) => {
								const isUndefined = this.isUndefined3d(
									shapedWeights,
									i,
									j,
									k
								);
								const currentWeight = isUndefined
									? []
									: shapedWeights[i][j][k];
								const sw = isUndefined
									? 1
									: 2 * Math.abs(currentWeight) + 0.1;
								const s = isUndefined
									? "lightgrey"
									: currentWeight > 0
									? posWeight
									: negWeight;
								return (
									<path
										key={k}
										d={d}
										className={playing}
										strokeWidth={sw}
										stroke={s}
										fill="none"
									></path>
								);
							})
						)
					)}
					<rect
						x={34}
						y={234}
						width={squareWidth}
						height={squareWidth}
						fill="darkgrey"
					></rect>

					{shapedRects.map((neuron, i) =>
						neuron.map((d, j) => {
							const curr =
								miniNN !== null ? miniNN.model[i][j] : null;
							return (
								<g>
									<rect
										x={d.x}
										y={d.y}
										width={squareWidth}
										height={squareWidth}
										fill="darkgrey"
									></rect>

									{miniNN !== null && mode
										? VerticalArrow(
												d.x + 16,
												d.y + 16,
												Math.abs(curr.dActStep),
												curr.dActStep < 0,
												"grey"
										  )
										: ""}
								</g>
							);
						})
					)}

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
