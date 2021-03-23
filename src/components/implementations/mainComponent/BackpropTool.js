/* 
  @author: Donny Bertucci: xnought
  Summary: 
	MainTool.js is the main controller of all logic of the backprop explainer
*/

import React, { Component } from "react";
import * as tf from "@tensorflow/tfjs";
import AnimatedNumber from "animated-number-react";
import {
	NeuralNetworkComponent,
	ScatterPlot,
	Loss,
	AnimatedScatterPlot,
	Summary,
} from "../../exports";
import {
	Typography,
	Box,
	Card,
	CardContent,
	IconButton,
	CardActions,
	Chip,
	Button,
	Fab,
	Tooltip,
	Dialog,
	DialogContent,
	DialogActions,
} from "@material-ui/core";
import {
	Replay,
	FastForward,
	PlayArrow,
	Stop,
	Help,
	Close,
	ArrowBackIos,
} from "@material-ui/icons";
import singleSummarySVG from "./assets/singleSummary.svg";
import epochModePNG from "./assets/epochMode.png";
import keySVG from "./assets/key.svg";
import { NeuralNetwork, tools } from "../../../nnMiniLibrary/exports";
import { draw } from "../../../Utils/exports";

class BackpropTool extends Component {
	constructor(props) {
		super(props);
		this.state = {
			/* State for NN */
			tensorFlowNN: null,
			miniNN: null,
			X: [],
			y: [],
			yhat: [],
			shape: [1, 8, 8, 8, 1],
			lr: 0.001,
			epoch: 0,
			cpyEpoch: 0,

			biasesData: [],
			weightsData: [],
			lossArray: [],
			loss: null,
			scale: 5,

			shapedWeights: [],
			shapedRects: [],
			shapedLinks: [],

			direction: "edgePaused",
			curve: "sin",

			/* State for Components */
			controls: {
				playing: false,
				speed: 100,
			},

			mode: false,
			stopRender: false,
			keyFrameLayer: 0,
			keyFrameLoss: 0,
			keyFrameScatter: 0,
			subEpoch: "",
			isAnimating: false,
			lossSavings: 0,
			lossDifference: 0,
			singleInputExample: 0,
			singleLabelExample: 0,
			newOutput: 0,

			/* Dialog showing */
			controlCenterHelp: false,
			customizationHelp: false,
			neuralNetworkHelp: false,
			lossChange: 0,
			potentialYhat: [],
			singleInputIndex: -1,
			shouldNotRender: false,
			status: "reset",
			zoom: 1,
		};

		this.initNeuralNetwork = this.initNeuralNetwork.bind(this);
		this.run = this.run.bind(this);
		this.genTensorData = this.genTensorData.bind(this);
		this.mutate = this.mutate.bind(this);
		this.train = this.train.bind(this);
		this.printParameters = this.printParameters.bind(this);
		this.reset = this.reset.bind(this);
		this.resetParameters = this.resetParameters.bind(this);
		this.asyncPause = this.asyncPause.bind(this);
		this.changeModelLr = this.changeModelLr.bind(this);
		this.anim = this.anim.bind(this);
		this.randExampleEpoch = this.randExampleEpoch.bind(this);
	}
	/* 
		Entire Neural network process along with random generation of single training		
		example.
	*/
	randExampleEpoch(X, y, weightsData, biasesData, shape, lr) {
		const randomInput = tools.getRandomInt(this.state.X.length);
		const singleInputExample = X[randomInput];
		const singleLabelExample = y[randomInput];

		let formattedWeights = tools.formatWeightArray(weightsData, shape);
		let nn = new NeuralNetwork(shape, formattedWeights, biasesData);
		let clone = new NeuralNetwork(shape, formattedWeights, biasesData);

		/* This is the actual neural network changes in animation */
		nn.forward(singleInputExample, singleLabelExample);
		nn.backward();

		/* This is the clone that goes one more forward to get the projected changes */
		clone.forward(singleInputExample, singleLabelExample);
		clone.backward();
		clone.update(lr);
		clone.forward(singleInputExample, singleLabelExample);

		/* Store outputs to variables */
		const newOutput = clone.yhat;
		const updatedLoss = clone.loss.output;
		const lossSavings = updatedLoss;
		const lossDifference = nn.loss.output - updatedLoss;

		/* computes the predictions for all values form the copy */
		const forwardAll = (inputArray) => {
			/* Here we return an array of all the inputs fed forward */
			const inputArrayLength = inputArray.length;
			let outputArray = new Array(inputArrayLength);

			for (let i = 0; i < inputArrayLength; i++) {
				clone.forward(inputArray[i], 0); //we dont care about loss here so the input label doesnt matter
				outputArray[i] = clone.yhat; //store all outputs to the outputArray
			}

			return outputArray; //return the output array to be used elsewhere
		};
		const potential = forwardAll(X);

		this.setState({
			...this.state,
			miniNN: nn,
			potentialYhat: potential,
			mode: true,
			lossSavings,
			lossDifference,
			singleInputIndex: randomInput,
			singleInputExample,
			singleLabelExample,
			newOutput,
			controls: {
				...this.state.controls,
				playing: false,
			},
		});
	}

	/*
		Controls the logic of the animation: keyframe animations controller	
	*/
	async anim() {
		const { shape } = this.state;
		const speed = 750;
		/* All anim needs to know is the shape */
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));

		/* animate the forward pass */
		this.setState({
			subEpoch: "forward",
			status: "reset",
			isAnimating: true,
			lossChange: 0,
			cpyEpoch: this.state.epoch,
			keyFrameScatter: 0,
		});
		for (let i = 0; i < shape.length; i++) {
			this.setState({ keyFrameLayer: i });
			if (i === shape.length - 1) {
				continue;
			}
			await timer(speed);
		}

		this.setState({
			keyFrameLoss: 1,
			keyFrameScatter: 1,
			status: "real",
			shouldNotRender: true,
		});

		await timer(speed);
		this.setState({ keyFrameLoss: 2, shouldNotRender: true });
		await timer(speed);
		this.setState({ keyFrameLoss: 3 });

		//we update the losschange
		this.setState({
			lossChange: this.state.miniNN.loss.output,
		});
		this.setState({ subEpoch: "backward", keyFrameScatter: 2 });

		for (let i = shape.length - 1; i >= 0; i--) {
			this.setState({ keyFrameLayer: i });
			await timer(speed);
		}
		this.setState({ keyFrameLayer: -1 });

		await timer(speed);
		this.setState({ subEpoch: "transition" });

		await timer(1000);
		this.setState({ subEpoch: "update", shouldNotRender: false });
		await timer(1000);
		//we update the new loss
		this.setState({
			isAnimating: false,
			lossChange: this.state.lossSavings,
			keyFrameScatter: 4,
			cpyEpoch: this.state.cpyEpoch + 1,
			status: "pred",
		});
	}

	/* 
		initialize the data for drawing the entire neural network
		@param shape	
	*/
	initNeuralNetwork(shape) {
		const { controls } = this.state;
		const { playing } = controls;

		// If we are not training the tensorflow neural network
		if (!playing) {
			/* START SETUP */
			const squareWidth = 32;
			const xConstraints = { domain: [0, 100], range: [50, 750] };
			const yConstraints = { domain: [0, 100], range: [500, 0] };
			//prettier-ignore
			const {xScale, yScale} = draw.generateLinearScale(xConstraints,yConstraints);
			// Create the starting point and the stopping point for the neural network
			const start = { x: 71 - squareWidth / 2, y: 250 - squareWidth / 2 };
			const stop = { x: 750 - squareWidth / 2, y: 250 - squareWidth / 2 };
			// generate function to create paths from (x,y) to (x,y)
			const linksGenerator = draw.generateLink(squareWidth / 2);
			// how the layers are proptioned compared to the linear scale
			const layerProportion = [0, 25, 50, 75, 0];
			/* END SETUP */

			/* START GENERATING THE GRAPH */
			const shapedNeurons = draw.generateNeuronPlacement(
				shape,
				layerProportion,
				squareWidth,
				start,
				stop,
				xScale,
				yScale
			);
			const layerLinks = draw.generateLinksPlacement(
				shape,
				shapedNeurons,
				linksGenerator
			);
			/* END GENERATING THE GRAPH */

			shapedNeurons.splice(0, 1); //in order for it to be lined up with the nn model
			//update the state of the links and rectangles to be rendered
			this.setState({
				shapedLinks: layerLinks,
				shapedRects: shapedNeurons,
			});
		} else if (playing) {
			const { weightsData, shape } = this.state;
			//update the weights to be rendered
			const shapedWeights = tools.formatWeightArray(weightsData, shape);
			this.setState({ shapedWeights });
		}
	}

	/* 
		changes the curent learning rate, tidy in case of memory leak here	
		@param lrChange
	*/
	changeModelLr(lrChange) {
		tf.tidy(() => {
			this.setState({ lr: lrChange });
			return undefined;
		});
	}

	/* 
		runs the training and switches the playing the reflect playing	
	*/
	async run() {
		const playing = !this.state.controls.playing;
		this.mutate("controls", "playing", playing);
		if (playing === true) {
			await this.train(this.state.X, this.state.y);
		}
	}

	/* 
		mutate helper method	
		@TODO remove this from the program	
	*/
	mutate(key, subkey, value) {
		/* copy of the state */
		tf.tidy(() => {
			let state = { ...this.state };
			/* If this.state.key.subkey exists */
			if (key in state && subkey in state[key]) {
				/* Mutate the state */
				state[key][subkey] = value;
				this.setState({ state });
			} else {
				console.error("Could not be found in state");
			}
			return undefined;
		});
	}

	/* 
		adds configurations to sequential model
		@param model : tfjs sequential 
	*/
	addModel(model) {
		return tf.tidy(() => {
			let shape = this.state.shape;
			model.add(
				tf.layers.dense({
					inputShape: [1],
					units: shape[1],
					activation: "relu",
					useBias: true,
				})
			);
			for (let layer = 2; layer < shape.length - 1; layer++) {
				model.add(
					tf.layers.dense({
						units: shape[layer],
						activation: "relu",
						useBias: true,
					})
				);
			}
			model.add(
				tf.layers.dense({
					units: 1,
					activation: "linear",
					useBias: true,
				})
			);

			return model;
		});
	}

	/* 
		compiles the model with learning rate given	
		@lr : learning rate	
	*/
	modelCompile(lr) {
		let model = tf.sequential();
		this.addModel(model);
		model.compile({
			optimizer: tf.train.sgd(lr),
			loss: "meanSquaredError",
		});
		return model;
	}

	/* 
		trains the model on one epoch and one input
		@param X, y
	*/
	async train(X, y) {
		/* START SETUP */
		const XTensor = tf.tidy(() => {
			return tf.tensor(X);
		});
		const yTensor = tf.tidy(() => {
			return tf.tensor(y);
		});
		const model = tf.tidy(() => {
			return this.state.tensorFlowNN;
		});
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		/* START SETUP */

		///* Until broken by user */
		let play = this.state.controls.playing;
		////let epoch = 0;
		while (play !== false) {
			this.setState({ stopRender: true });
			const { playing, speed } = this.state.controls;
			play = playing;
			await model.fit(XTensor, yTensor, {
				epochs: 1,
				batchSize: 1,
			});
			tf.tidy(() => {
				let yhatTensor = model.predict(XTensor);
				let yhat = tools.tensorToArray(yhatTensor);
				let loss = tf.losses.meanSquaredError(y, yhat).dataSync()[0];
				this.printParameters(model, loss, yhat, this.state.epoch + 1);
				return undefined;
			});
			this.setState({ stopRender: false });
			await timer(speed);
		}
		this.setState({ tensorFlowNN: model });
		tf.dispose(XTensor);
		tf.dispose(yTensor);
	}

	/* 
		generate the data in tensor form 	
		@param eqn, scaled, volume	
	*/
	async genTensorData(eqn, scaled, volume) {
		await tf.ready();
		tf.tidy(() => {
			const XTensor = tf.linspace(
				-this.state.scale,
				this.state.scale,
				volume
			);
			const yTensor = tf.mul(eqn(XTensor), scaled);
			const yhatTensor = tf.zerosLike(XTensor);
			const X = tools.tensorToArray(XTensor);
			const y = tools.tensorToArray(yTensor);
			const yhat = tools.tensorToArray(yhatTensor);

			this.setState({
				X,
				y,
				yhat,
			});
			return undefined;
		});
	}

	/* 
		formats and updates the state for bias and weights from tfjs model 
		in an effort to eventually print them / use them for svg
		@param model, loss, yhat, epoch	
	*/
	printParameters(model, loss, yhat, epoch) {
		let weightsData = [];
		let biasesData = [];
		for (let i = 0; i < model.getWeights().length; i++) {
			(i % 2 === 0 ? weightsData : biasesData).push(
				Array.from(model.getWeights()[i].dataSync())
			);
		}
		const lossArray = [...this.state.lossArray, loss];
		this.setState({
			biasesData,
			weightsData,
			loss,
			yhat,
			epoch,
			lossArray,
		});
		this.initNeuralNetwork(this.state.shape);
	}

	/* 
		simply to pause
	*/
	async asyncPause() {
		this.setState({ controls: { ...this.state.controls, playing: false } });
	}

	/* 
		resets all the parameters
		@param scale	
	*/
	async resetParameters(scale) {
		tf.dispose(this.state.tensorFlowNN);
		const { curve } = this.state;
		let eqn;
		let optimizer;
		tf.tidy(() => {
			if (curve === "sin") {
				eqn = tf.sin;
			} else if (curve === "tanh") {
				eqn = tf.tanh;
			} else if (curve === "cos") {
				eqn = tf.cos;
			}

			return undefined;
		});
		await this.genTensorData(eqn, scale, 50);
		const model = tf.tidy(() => {
			return this.modelCompile(this.state.lr);
		});
		this.setState({
			epoch: 0,
			loss: null,
			miniNN: null,
			tensorFlowNN: model,
			shapedWeights: [],
			lossArray: [],
		});
		tf.dispose(optimizer);
	}

	/* 
		full reset	
		resets the paramters and pauses 
	*/
	async reset(scale) {
		this.asyncPause();
		this.resetParameters(scale);
	}

	/* 
		used a linear equation to get the zoom for the svg
		@param clientWidth
		@TODO figure out how to do this more dynamically	
	*/
	correctZoom(width) {
		const zoomFactor = (1 - 0.75) / (1387 - 913);
		const zoomShift = 0.75 - zoomFactor * 913;
		const zoom = Math.min(1, zoomFactor * width + zoomShift - 0.2);
		return zoom;
	}

	async componentDidMount() {
		/* initialize the everything on mount */
		tf.setBackend("cpu"); //for some reason webgl not working on safari
		this.genTensorData(tf.sin, this.state.scale, 50);
		this.initNeuralNetwork(this.state.shape);
		const model = tf.tidy(() => {
			return this.modelCompile(this.state.lr);
		});
		const width = document.body.clientWidth;
		const zoom = this.correctZoom(width);
		this.setState({ tensorFlowNN: model, zoom });
	}
	shouldComponentUpdate() {
		if (this.state.stopRender) {
			return false;
		} else {
			return true;
		}
	}
	render() {
		/* Destructure State*/
		const {
			X,
			y,
			shape,
			scale,
			miniNN,
			weightsData,
			biasesData,
			yhat,
			mode,
			epoch,
			curve,
			lr,
			loss,
			controls,
			shapedWeights,
			shapedLinks,
			shapedRects,
			keyFrameLayer,
			keyFrameLoss,
			subEpoch,
			isAnimating,
			singleInputExample,
			singleLabelExample,
			lossSavings,
			controlCenterHelp,
			customizationHelp,
			neuralNetworkHelp,
			lossChange,
			keyFrameScatter,
			zoom,
		} = this.state;
		const { playing, speed } = controls;

		const lrs = [0.0001, 0.001, 0.003, 0.005];
		const dataSets = [
			{ label: "sin", eqn: tf.sin, scale: 5 },
			{ label: "cos", eqn: tf.cos, scale: 5 },
			{ label: "tanh", eqn: tf.tanh, scale: 5 },
		];

		/* Destructure render */
		const PlayButtonClick = (
			// eslint-disable-next-line
			<Fab
				style={{
					background: !this.state.controls.playing
						? "#175676"
						: "#D62839",
					color: "white",
				}}
				disableTouchRipple
				onClick={() => this.run()}
			>
				{!playing ? <PlayArrow /> : <Stop />}
			</Fab>
		);
		const controlsReg = (
			<CardActions>
				<Tooltip title="reset" arrow>
					<IconButton
						disabled={playing}
						onClick={() => {
							this.reset(scale);
						}}
					>
						<Replay />
					</IconButton>
				</Tooltip>
				{PlayButtonClick}
				<Tooltip title="speed up" arrow>
					<IconButton
						style={{
							color: speed === 0 ? "#FFC006" : "grey",
						}}
						onClick={() => {
							this.setState({
								controls: {
									...controls,
									speed: speed === 0 ? 100 : 0,
								},
							});
						}}
					>
						<FastForward />
					</IconButton>
				</Tooltip>
			</CardActions>
		);
		const controlsBackProp = (
			<Box marginTop={2}>
				<CardActions>
					<Button
						onClick={async () => {
							await this.anim();
						}}
						disabled={isAnimating}
						style={{
							color: isAnimating ? "lightgrey" : "black",

							borderColor: isAnimating ? "lightgrey" : "black",
						}}
						variant="outlined"
						size="small"
					>
						REPLAY
					</Button>

					<Button
						onClick={async () => {
							this.randExampleEpoch(
								X,
								y,
								weightsData,
								biasesData,
								shape,
								lr,
								mode
							);
							await this.anim();
						}}
						style={{
							color: isAnimating ? "lightgrey" : "#4BA3C3",
							borderColor: isAnimating ? "lightgrey" : "#4BA3C3",
						}}
						disabled={isAnimating}
						variant="outlined"
						size="small"
					>
						New Training Example
					</Button>
				</CardActions>
			</Box>
		);
		const controlCenter = (
			<Box width={400} marginLeft={10}>
				<Card variant="outlined">
					<CardContent>
						<Typography
							variant="caption"
							style={{
								color: "#4BA3C3",
							}}
						>
							{"Control Center"}
							<IconButton
								size="small"
								style={{ color: "orange" }}
								onClick={() => {
									this.setState({ controlCenterHelp: true });
								}}
							>
								<Help />
							</IconButton>
						</Typography>
						<div></div>

						<Typography variant="h4">
							EPOCH: {mode ? this.state.cpyEpoch : epoch}
						</Typography>

						{mode ? (
							<CardActions>
								<Typography
									style={{
										color: "orange",
									}}
									variant="h6"
								>
									Phase:
								</Typography>
								<Button
									disabled={true}
									style={{
										color:
											subEpoch === "forward"
												? "orange"
												: "grey",
									}}
								>
									Forward
								</Button>
								<Button
									disabled={true}
									style={{
										color:
											subEpoch === "backward"
												? "orange"
												: "grey",
									}}
								>
									Backward
								</Button>
								<Button
									disabled={true}
									style={{
										color:
											subEpoch === "update"
												? "orange"
												: "grey",
									}}
								>
									Update
								</Button>
							</CardActions>
						) : (
							""
						)}

						<Typography variant="h6">
							{loss == null || mode
								? ""
								: `Loss: ${loss.toPrecision(6)}`}
						</Typography>

						<Typography variant="h6" style={{ color: "#4BA3C3" }}>
							{mode
								? `Training Example: (${singleInputExample.toPrecision(
										3
								  )}, ${singleLabelExample.toPrecision(3)})`
								: ""}
						</Typography>

						<Typography
							variant="h5"
							style={{
								color:
									keyFrameScatter < 3 ? "black" : "orangered",
							}}
						>
							{mode && lossChange !== 0
								? keyFrameScatter < 3
									? "loss: "
									: "new loss: "
								: ""}
							{mode && lossChange !== 0 ? (
								<AnimatedNumber
									value={lossChange}
									formatValue={(value) =>
										value.toPrecision(6)
									}
									duration={750}
								/>
							) : (
								""
							)}
						</Typography>
						<Typography style={{ color: "grey" }} variant="caption">
							{keyFrameScatter > 3 && mode
								? "loss decrease: "
								: ""}
							{keyFrameScatter > 3 && mode ? (
								<AnimatedNumber
									value={this.state.lossDifference}
									formatValue={(value) =>
										value.toPrecision(6)
									}
									duration={750}
								/>
							) : (
								""
							)}
						</Typography>

						{mode ? controlsBackProp : controlsReg}

						<CardActions>
							{loss == null || isAnimating ? (
								""
							) : (
								<Button
									variant="outlined"
									style={{
										color: "#175676",
										borderColor: "#175676",
									}}
									onClick={async () => {
										if (mode) {
											this.setState({
												subEpoch: "",
												mode: !mode,
											});
											this.run();
										} else {
											this.randExampleEpoch(
												X,
												y,
												weightsData,
												biasesData,
												shape,
												lr,
												mode
											);
											await this.anim();
										}
									}}
								>
									{mode ? <ArrowBackIos /> : ""}
									{mode
										? "go back to fitting"
										: `Click to Animate epoch ${epoch}`}
								</Button>
							)}
						</CardActions>
					</CardContent>
				</Card>

				<Box marginTop={5}>
					<Card variant="outlined">
						<CardContent>
							<Typography
								variant="caption"
								style={{
									color: "#4BA3C3",
								}}
							>
								{"Customization"}
								<IconButton
									size="small"
									style={{ color: "orange" }}
									onClick={() => {
										this.setState({
											customizationHelp: true,
										});
									}}
								>
									<Help />
								</IconButton>
							</Typography>
							<CardActions>
								<Typography variant="caption">
									Learning Rate
								</Typography>
								{lrs.map((num, i) => (
									<Chip
										disabled={playing || mode}
										key={i}
										label={`${num}`}
										style={{
											color:
												lr === num ? "white" : "grey",
											background:
												lr === num
													? "#175676"
													: "lightgrey",
										}}
										onClick={() => {
											tf.tidy(() => {
												this.changeModelLr(num);
												this.reset(scale);
												return undefined;
											});
										}}
									></Chip>
								))}
							</CardActions>
							<CardActions>
								<Typography variant="caption">
									Data Set
								</Typography>
								{dataSets.map((item, i) => (
									<Chip
										disabled={playing || mode}
										key={i}
										label={item.label}
										style={{
											color:
												curve === item.label
													? "white"
													: "grey",
											background:
												curve === item.label
													? "#175676"
													: "lightgrey",
										}}
										onClick={() => {
											this.setState({
												shape,
												curve: item.label,
											});
											this.reset(scale);
											tf.tidy(() => {
												this.genTensorData(
													item.eqn,
													item.scale,
													50
												);
												return undefined;
											});
										}}
									></Chip>
								))}
							</CardActions>
							<CardActions>
								<Typography variant="caption">Layer</Typography>

								<Button
									disabled={playing || mode}
									onClick={() => {
										let a = shape;
										if (a.length < 5) {
											a[a.length - 1] = 8;
											a.push(1);
											this.setState({ shape: a });
											this.initNeuralNetwork(a);
											this.reset(scale);
										}
									}}
								>
									+
								</Button>

								<Button
									disabled={playing || mode}
									onClick={() => {
										let a = shape;
										if (a.length > 3) {
											a.splice(a.length - 2, 1);
											this.setState({ shape: a });
											this.initNeuralNetwork(a);
											this.reset(scale);
										}
									}}
								>
									–
								</Button>
							</CardActions>
						</CardContent>
					</Card>
				</Box>
			</Box>
		);
		const scatter = (
			<Box marginLeft={10}>
				<Box>
					{mode ? (
						<AnimatedScatterPlot
							width={300}
							height={300}
							padding={0}
							start={-scale}
							stop={scale}
							X={X}
							y={y}
							yhat={yhat}
							potential={this.state.potentialYhat}
							id={2}
							select={this.state.singleInputIndex}
							times={this.state.keyFrameScatter}
							shouldNotRender={this.state.shouldNotRender}
							status={this.state.status}
						/>
					) : (
						<ScatterPlot
							width={300}
							height={300}
							padding={0}
							start={-scale}
							stop={scale}
							X={X}
							y={y}
							yhat={yhat}
							id={1}
							duration={200}
							select={-1}
						/>
					)}
				</Box>
				<Box marginTop={10}>
					<Loss lossArray={this.state.lossArray} duration={100} />
				</Box>
			</Box>
		);
		const neuralNetwork = (
			<Box>
				<NeuralNetworkComponent
					miniNN={miniNN}
					input={singleInputExample}
					label={singleLabelExample}
					shapedWeights={shapedWeights}
					shapedLinks={shapedLinks}
					shapedRects={shapedRects}
					shape={shape}
					biases={biasesData}
					playing={
						playing
							? speed === 0
								? "edgeForward"
								: "edgeSlowed"
							: "edgePaused"
					}
					show={playing}
					mode={mode}
					backward={this.state.direction}
					keyFrameLayer={keyFrameLayer}
					keyFrameLoss={keyFrameLoss}
					subEpoch={subEpoch}
					lossSavings={lossSavings}
					isAnimating={isAnimating}
					lr={lr}
				></NeuralNetworkComponent>
				<IconButton
					size="small"
					style={{
						color: "orange",
						position: "relative",
						bottom: "500px",
						left: "100px",
					}}
					onClick={() => {
						this.setState({
							neuralNetworkHelp: true,
						});
					}}
				>
					<Help />
				</IconButton>
			</Box>
		);

		const dialogs = (
			<div>
				<Dialog
					PaperProps={{
						style: {
							backgroundColor: "#F7F7F7",
						},
					}}
					open={controlCenterHelp}
				>
					<DialogActions>
						<IconButton
							onClick={() => {
								this.setState({ controlCenterHelp: false });
							}}
						>
							<Close />
						</IconButton>
					</DialogActions>

					<DialogContent>
						<Box display="flex" justifyContent="center">
							<Box marginBottom={1}>
								<Typography variant="h5">
									<b>Getting Stuck?</b>
								</Typography>
								<Typography variant="body1">
									<ol>
										<li>
											Press{" "}
											<Fab
												style={{
													background: "#175676",
													color: "white",
												}}
												size="small"
												disabled={true}
											>
												<PlayArrow fontSize="small" />
											</Fab>{" "}
											to start training and fitting the
											curve to the data
										</li>
										<li>
											Then press{" "}
											<Button
												variant="outlined"
												size="small"
												style={{
													borderColor: "#175676",
													color: "#175676",
												}}
												disabled={true}
											>
												Click to animate epoch #
											</Button>{" "}
											to see forward propagation,{" "}
											<b>backward propagation</b>, and
											update animation at the epoch #.
											While in this mode, you will have
											access to the control center{" "}
											<b>below</b>
											<img
												alt="epochMode"
												src={epochModePNG}
												width="100%"
											></img>
										</li>
										<li>
											To go back to training and fitting
											the curve to the data click{" "}
											<Button
												variant="outlined"
												size="small"
												style={{
													borderColor: "#175676",
													color: "#175676",
												}}
												disabled={true}
											>
												<ArrowBackIos /> Go back to
												fitting
											</Button>{" "}
										</li>
									</ol>
								</Typography>
							</Box>
						</Box>
					</DialogContent>
				</Dialog>
				<Dialog
					PaperProps={{
						style: {
							backgroundColor: "#F7F7F7",
						},
					}}
					open={customizationHelp}
				>
					<DialogActions>
						<IconButton
							onClick={() => {
								this.setState({ customizationHelp: false });
							}}
						>
							<Close />
						</IconButton>
					</DialogActions>

					<DialogContent>
						<Box display="flex" justifyContent="center">
							<Box marginBottom={5}>
								<Typography variant="h5">
									<b>What you can't and can change</b>
								</Typography>
								<br />
								<Typography variant="h6">
									<b>Fixed</b>
								</Typography>
								<Typography variant="body1">
									By default, this Neural Network stays fixed
									with
									<ol>
										<li>
											one input neuron, at least one
											hidden layer of eight ReLU neurons,
											and an output layer with one linear
											neuron.
										</li>
										<li>
											Stochastic Gradient Descent (one
											training example per epoch)
										</li>
									</ol>
								</Typography>

								<Typography variant="h6">
									<b>Variable</b>
								</Typography>
								<Typography variant="body1">
									You have the ability to change
									<ol>
										<li>
											Learning Rate (0.0001, 0.001, 0.003,
											or 0.005)
										</li>
										<li>
											Data set (sine wave, cosine wave, or
											tanh curve)
										</li>
										<li>
											Hidden layer neurons (min 1 and max
											3)
										</li>
									</ol>
								</Typography>
							</Box>
						</Box>
					</DialogContent>
				</Dialog>

				<Dialog
					PaperProps={{
						style: {
							backgroundColor: "#FAFAFA",
						},
					}}
					open={neuralNetworkHelp}
				>
					<DialogActions>
						<IconButton
							onClick={() => {
								this.setState({ neuralNetworkHelp: false });
							}}
						>
							<Close />
						</IconButton>
					</DialogActions>

					<DialogContent>
						<Box display="flex" justifyContent="center">
							<Box>
								<img src={Summary} alt="summary" width="400" />
							</Box>
						</Box>
						<Box display="flex" justifyContent="center">
							<Box marginBottom={5}>
								<Typography variant="h6">
									<b>Neural Network</b>
								</Typography>
								<Typography variant="body1">
									Each square is a neuron in the neural
									network. To see what activation function the
									neuron has, check the key located right
									above the neural network.
								</Typography>
							</Box>
						</Box>
						<img
							src={singleSummarySVG}
							alt="singleSummary"
							width="100%"
						/>
						<Box display="flex" justifyContent="center">
							<Box marginBottom={5}>
								<Typography variant="h6">
									<b>Single EPOCH mode</b>
								</Typography>
								<Typography variant="body1">
									During a single epoch after clicking{" "}
									<Button
										variant="outlined"
										size="small"
										style={{
											borderColor: "#175676",
											color: "#175676",
										}}
										disabled={true}
									>
										Click to animate epoch #
									</Button>{" "}
									, each arrow will represent the direction to
									nudge the output to lower loss.
								</Typography>
								<Typography variant="body1">
									The fill color shows the activation output,
									brighter is more active.
								</Typography>
							</Box>
						</Box>
					</DialogContent>
				</Dialog>
			</div>
		);

		return (
			<div id="app">
				<Card
					variant="outlined"
					style={{
						background: "#FAFAFA",
						outlineColor: "white",
						paddingBottom: "1em",
					}}
				>
					<CardContent
						style={{
							transform: `scale(${zoom})`,
						}}
					>
						<Box display="flex" justifyContent="center">
							<Box marginRight={90}>
								<img src={keySVG} alt="key"></img>
							</Box>
							<Box>
								<Typography variant="h2">
									<b>EPOCH Tool</b>
								</Typography>
							</Box>
						</Box>
						<Box
							className="regular"
							display="flex"
							justifyContent="center"
							marginTop={2}
						>
							{neuralNetwork}
							{scatter}
							{controlCenter}
						</Box>
					</CardContent>
				</Card>
				{dialogs}
			</div>
		);
	}
}

export default BackpropTool;
