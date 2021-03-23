/* 
	Donny Bertucci @xnought
	Summary: 
		NeuralNetworkComponent.js is a compomnent that handles all neural network
		logic for the backproptool neural network representation
*/
import React from "react";
import * as d3 from "d3";
import Arrow from "./Arrow";
import "../d3.css";

const NeuralNetworkComponent = (props) => {
	/* 
		@param val
		@return true if undefined	
	*/
	const isUndefined = (val) => typeof val === "undefined";
	/* 
		check if the 3d array index is defined
		@param array3d, i, j , k
		@return returns true if one of the depths is undefined	
	*/
	const isUndefined3d = (array3d, i, j, k) => {
		return (
			isUndefined(array3d[i]) ||
			isUndefined(array3d[i][j]) ||
			isUndefined(array3d[i][j][k])
		);
	};
	/* 
		@param 	xStart, yStart, length, dirIsUp, color
		@return <Arrow />	
	*/
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
	/* 
		spandrel
		@return "css class"
	*/
	const keyFrameLossCalc = () => {
		if (keyFrameLoss === 1) {
			return "edgeForward";
		} else if (keyFrameLoss === 2) {
			return "edgeBackward";
		} else {
			return "edgePaused";
		}
	};
	/* Destructure props */
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
		lr,
		isAnimating,
	} = props;
	/* confgure how things will look */
	const colorOfMotion = "orange";
	const negWeight = "#D62839";
	const posWeight = "#4BA3C3";
	const graphConnectionColor = "black";
	const squareWidth = 32;
	const link = d3
		.linkHorizontal()
		.x((d) => d.x)
		.y((d) => d.y);

	/*  main nn nerual network composition */
	const nn = (
		<svg id="p" width="810" height="500" overflow="visible">
			<g id="ee">
				<path
					d="M 750, 234 L 750, 300"
					stroke={
						keyFrameLoss === 2 || keyFrameLoss === 1
							? colorOfMotion
							: graphConnectionColor
					}
					className={
						mode && keyFrameLoss > 0 ? keyFrameLossCalc() : playing
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
						/* handle for change in layers */
						let moving = "edgePaused";
						let color = colorOfMotion;
						let colorChange = false;
						if (
							mode &&
							subEpoch === "forward" &&
							i === keyFrameLayer
						) {
							moving = "edgeForward";
							colorChange = true;
						} else if (
							mode &&
							subEpoch === "backward" &&
							i === keyFrameLayer
						) {
							moving = "edgeBackward";
							colorChange = true;
						}
						return neuron.map((d, k) => {
							/* handle undefined outputs during re render */
							const isUndefined = isUndefined3d(
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
								isAnimating === true
							) {
								let gradient =
									2 * miniNN.model[i][j].dWeights[k];
								let gradientWithLr = gradient * 0.01;

								/* Find a way to rework this later with non horrible names */
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
									.attr("stroke-width", sw - gradientWithLr);
							}

							return (
								<path
									id={`cpath${i}${j}${k}`}
									key={`${i}${j}${k}`}
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
						/* handle for neurons and different times */
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
							<g key={`${i},${j}`}>
								<rect
									x={d.x}
									y={d.y}
									width={squareWidth}
									height={squareWidth}
									fill={
										d.x === 734 && d.y === 234 && mode
											? "#C6C6C6"
											: d3
													.rgb(104, 104, 104)
													.brighter(
														actColor
															? miniNN.model[i][j]
																	.actStep +
																	lr
															: 1
													)
									}
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
											colorOfMotion
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
				<text fontFamily="sans-serif" fontSize="12px" x={739} y={318}>
					loss
				</text>
			</g>
		</svg>
	);
	return <div id="nn">{nn}</div>;
};

export default NeuralNetworkComponent;
