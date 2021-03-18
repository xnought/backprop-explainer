import React, { Component } from "react";
import * as d3 from "d3";
import { Help } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
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
			subEpoch,
			keyFrameLoss,
			keyFrameLayer,
			input,
			label,
			children,
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
					isAnimating={subEpoch === "transition"}
				/>
			);
		};
		const keyFrameLossCalc = () => {
			if (keyFrameLoss === 1) {
				return "edgeForward";
			} else if (keyFrameLoss === 2) {
				return "edgeBackward";
			} else {
				return "edgePaused";
			}
		};

		const nn = (
			<svg id="p" width="810" height="500" overflow="visible">
				<g id="ee">
					<path
						d="M 750, 234 L 750, 300"
						stroke={
							keyFrameLoss === 2 || keyFrameLoss === 1
								? "orange"
								: graphConnectionColor
						}
						className={
							mode && keyFrameLoss > 0
								? keyFrameLossCalc()
								: playing
						}
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
					{shapedLinks.map((layer, i) => {
						return layer.map((neuron, j) => {
							let moving = "edgePaused";
							let color = "orange";
							let colorChange = false;
							if (
								mode &&
								subEpoch === "forward" &&
								i === keyFrameLayer
							) {
								moving = "edgeForward";
								colorChange = true;
								color = "orange";
							} else if (
								mode &&
								subEpoch === "backward" &&
								i === keyFrameLayer
							) {
								moving = "edgeBackward";
								colorChange = true;
							}
							return neuron.map((d, k) => {
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

								if (
									mode &&
									subEpoch === "update" &&
									this.props.isAnimating === true
								) {
									let gradient =
										2 * miniNN.model[i][j].dWeights[k];
									let gradientWithLr = gradient * 0.01;

									d3.select("#nn")
										.select("#p")
										.select("#ee")
										.select(`#cpath${i}${j}${k}`)
										.transition()
										.duration(750)
										.ease(d3.easeExpIn)
										.attr("stroke-width", sw - gradient)
										.transition()
										.duration(750)
										.ease(d3.easeExpOut)
										.attr(
											"stroke-width",
											sw - gradientWithLr
										);
								}

								return (
									<path
										id={`cpath${i}${j}${k}`}
										key={k}
										d={d}
										className={mode ? moving : playing}
										strokeWidth={sw}
										stroke={colorChange ? color : s}
										fill="none"
									></path>
								);
							});
						});
					})}
					<rect
						x={55}
						y={234}
						width={squareWidth}
						height={squareWidth}
						fill="darkgrey"
					></rect>

					{shapedRects.map((neuron, i) =>
						neuron.map((d, j) => {
							let actColor = false;
							const beforeUpdate =
								subEpoch === "backward" ||
								subEpoch === "transition";
							if (
								(mode && i <= keyFrameLayer) ||
								beforeUpdate ||
								subEpoch === "update"
							) {
								actColor = true;
							}
							return (
								<g>
									<rect
										x={d.x}
										y={d.y}
										width={squareWidth}
										height={squareWidth}
										fill={d3
											.rgb(104, 104, 104)
											.brighter(
												actColor
													? miniNN.model[i][j]
															.actStep +
															this.props.lr
													: 1
											)}
										stroke={
											d.x === 734 && d.y === 234
												? "#507BB6"
												: "black"
										}
										strokeWidth={3}
									></rect>

									{miniNN !== null &&
									mode &&
									beforeUpdate &&
									i >= keyFrameLayer - 1 &&
									miniNN.model[i][j].dActStep !== 0
										? VerticalArrow(
												d.x + 16,
												d.y + 16,
												Math.abs(
													miniNN.model[i][j].dActStep
												),
												miniNN.model[i][j].dActStep < 0,
												"orange"
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
		return <div id="nn">{nn}</div>;
	}
}

export default NeuralNetworkComponent;
