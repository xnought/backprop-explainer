/* 
  @author: Donny Bertucci: xnought
  Summary: 
	MainTool.js is the main controller of all logic of the backprop explainer
*/

/*  START IMPORTS  */
import React, { Component } from "react";
import * as tf from "@tensorflow/tfjs";
import AnimatedNumber from "animated-number-react";
import {
	NeuralNetworkComponent,
	ScatterPlot,
	Loss,
	AnimatedScatterPlot,
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
	Slider,
	Tooltip,
	Dialog,
	DialogContent,
	DialogActions,
} from "@material-ui/core";
import {
	Replay,
	SlowMotionVideo,
	FastForward,
	PlayArrow,
	Stop,
	Help,
	Close,
} from "@material-ui/icons";
import controlGif from "./assets/controlcenter.gif";
import customGif from "./assets/customization.gif";
import nnDiagram from "./assets/nn.png";
import scatterGif from "./assets/scatter.gif";
import keySVG from "./assets/key.svg";
import { NeuralNetwork, tools } from "../../../nnMiniLibrary/exports";
import { draw } from "../../../Utils/exports";
/*  END IMPORTS  */

class MainTool extends Component {
	constructor(props) {
		super(props);
		/* 
			App js state will be the main controller of logic to components
			Note to self: Keep state as shallow as possible to avoid complexity with this.setState()
		*/
		this.state = {
			/* State for NN */
			tensorFlowNN: null,
			miniNN: null,
			X: [],
			y: [],
			yhat: [],
			shape: [1, 8, 8, 1],
			lr: 0.001,
			epoch: 0,
			cpyEpoch: 0,

			biasesData: [],
			weightsData: [],
			lossArray: [],
			loss: null,
			scale: 5,
			rects: [],

			weights: [],
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
			sliderVal: 2,
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
			scatterHelp: false,
			lossHelp: false,
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
		this.randomInputGeneration = this.randomInputGeneration.bind(this);
	}
	randomInputGeneration(X, y, weightsData, biasesData, shape, lr, mode) {
		const randomInput = tools.getRandomInt(50);
		const singleInputExample = X[randomInput];
		const singleLabelExample = y[randomInput];

		let formattedWeights = tools.formatWeightArray(weightsData, shape);
		let nn = new NeuralNetwork(shape, formattedWeights, biasesData);
		let clone = new NeuralNetwork(shape, formattedWeights, biasesData);

		nn.forward(singleInputExample, singleLabelExample);
		nn.backward();

		clone.forward(singleInputExample, singleLabelExample);
		clone.backward();
		clone.update(lr);
		clone.forward(singleInputExample, singleLabelExample);

		const newOutput = clone.yhat;
		const updatedLoss = clone.loss.output;
		const lossSavings = updatedLoss;
		const lossDifference = nn.loss.output - updatedLoss;

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
		let a = forwardAll(X);

		this.setState({
			...this.state,
			miniNN: nn,
			potentialYhat: a,
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

		/* animate update */
	}

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
			const {
				flattenedNeurons,
				shapedNeurons,
			} = draw.generateNeuronPlacement(
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
				rects: flattenedNeurons,
				shapedRects: shapedNeurons,
			});
		} else if (playing) {
			const { weightsData, shape } = this.state;
			const flattenedWeights = tools.flatten(weightsData);
			//update the weights to be rendered
			const shapedWeights = tools.formatWeightArray(weightsData, shape);

			this.setState({ weights: flattenedWeights, shapedWeights });
		}
	}

	changeModelLr(lrChange) {
		tf.tidy(() => {
			this.setState({ lr: lrChange });
			return undefined;
		});
	}

	async run() {
		const playing = !this.state.controls.playing;
		this.mutate("controls", "playing", playing);
		if (playing === true) {
			await this.train(this.state.X, this.state.y);
		}
	}

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
	modelCompile(lr) {
		let model = tf.sequential();
		this.addModel(model);
		model.compile({
			optimizer: tf.train.sgd(lr),
			loss: "meanSquaredError",
		});
		return model;
	}
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
	async asyncPause() {
		this.setState({ controls: { ...this.state.controls, playing: false } });
	}
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
			weights: [],
			miniNN: null,
			tensorFlowNN: model,
			shapedWeights: [],
			lossArray: [],
		});
		tf.dispose(optimizer);
	}
	async reset(scale) {
		this.asyncPause();
		this.resetParameters(scale);
	}

	correctZoom(width) {
		const zoomFactor = (1 - 0.75) / (1387 - 913);
		const zoomShift = 0.75 - zoomFactor * 913;
		const zoom = Math.min(1, zoomFactor * width + zoomShift - 0.2);
		return zoom;
	}
	async componentDidMount() {
		tf.setBackend("cpu");
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
			rects,
			weights,
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
			scatterHelp,
			keyFrameScatter,
			zoom,
		} = this.state;
		const { playing, speed } = controls;

		const lrs = [0.0001, 0.001, 0.003, 0.005, 0.05];
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
						style={{ color: isAnimating ? "lightgrey" : "black" }}
						variant="outlined"
					>
						<Replay /> {"  "}REPLAY
					</Button>

					<Button
						onClick={async () => {
							this.randomInputGeneration(
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
						style={{ color: isAnimating ? "lightgrey" : "#4BA3C3" }}
						disabled={isAnimating}
						variant="outlined"
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

						<Tooltip
							title={
								<Typography variant="h6">
									<b>
										{mode
											? "Click to go back to fitting"
											: "Click to see backpropagation"}
									</b>
								</Typography>
							}
							arrow
							placement="top-start"
						>
							<Button
								disabled={loss == null || isAnimating}
								variant="contained"
								onClick={async () => {
									if (mode) {
										this.setState({
											subEpoch: "",
											mode: !mode,
										});
										this.run();
									} else {
										this.randomInputGeneration(
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
								<Typography variant="h4">
									Epoch: {mode ? this.state.cpyEpoch : epoch}
								</Typography>
							</Button>
						</Tooltip>

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
							{mode && lossChange != 0
								? keyFrameScatter < 3
									? "loss: "
									: "new loss: "
								: ""}
							{mode && lossChange != 0 ? (
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

						<CardActions></CardActions>
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
								{"Customization "}
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
								<Typography variant="caption">
									Neurons
								</Typography>

								<Slider
									style={{ color: "#175676" }}
									defaultValue={2}
									disabled={playing || mode}
									aria-labelledby="discrete-slider"
									valueLabelDisplay="auto"
									step={1}
									marks
									onChange={(e, n) => {
										this.setState({ sliderVal: n });
									}}
									min={1}
									max={8}
								/>
								<Button
									disabled={playing || mode}
									onClick={() => {
										let a = shape;
										if (a.length < 5) {
											a[
												a.length - 1
											] = this.state.sliderVal;
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

					<IconButton
						size="small"
						style={{
							color: "orange",
							position: "relative",
							bottom: "300px",
							right: "40px",
						}}
						onClick={() => {
							this.setState({
								scatterHelp: true,
							});
						}}
					>
						<Help />
					</IconButton>
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
					weights={weights}
					rects={rects}
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
								<img src={keySVG}></img>
							</Box>
							<Box>
								<Typography variant="h2">
									<b>Backprop Tool</b>
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
						<img
							src={controlGif}
							alt="how to use control center"
							width="100%"
						/>

						<Typography variant="caption">
							The <em>control</em> center is where you{" "}
							<em>control</em> the flow of the program. You can
							play, pause, slow down and reset.
						</Typography>
						<Box display="flex" justifyContent="center">
							<Box marginBottom={5}>
								<Typography variant="h6">
									What is an Epoch?
								</Typography>

								<Typography variant="body2">
									An epoch is single iteration of training.
								</Typography>

								<Typography variant="h6">
									What is Loss?
								</Typography>
								<Typography variant="body2">
									Loss tells you the error of the current
									predicitions. Lower is better.
								</Typography>

								<Typography variant="h6">
									How Do I go into Backpropogation Mode?
								</Typography>
								<Typography variant="body2">
									Click on the EPOCH
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
						<img
							src={customGif}
							alt="how to use control center"
							width="100%"
						/>

						<Typography variant="caption">
							The <em>customization</em> is where you{" "}
							<em>customize</em> data, learning rate, and model
							shape.
						</Typography>
						<Box display="flex" justifyContent="center">
							<Box marginBottom={5}>
								<Typography variant="h6">
									What is an Learning Rate?
								</Typography>

								<Typography variant="body2">
									Learning rate roughly translates to the
									magnitiude of change each time parameters
									are updated. You could think of it as how
									big your steps are down a gradient.
								</Typography>

								<Typography variant="body2">
									The learning rate is applied to the opposite
									gradient after backpropogation.
								</Typography>

								<Typography variant="h6">
									Why would I change learning rate?
								</Typography>

								<Typography variant="body2">
									Depending on the shape of the model and the
									amount of data,a higher learning rate could
									allow your model to take less epochs to
									reach the target loss. But if the learning
									rate is too large, you will never reach the
									minimum of loss that you want.
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
						<img
							src={nnDiagram}
							alt="how to use control center"
							width="100%"
						/>

						<Box display="flex" justifyContent="center">
							<Box marginBottom={5}>
								<Typography variant="h6">Summary</Typography>

								<Typography variant="body2">
									Each grey square with a black outline is a
									neuron. Each connection indicates where the
									inputs travel. The thikness and the color of
									each connection also indicate the weight
									associated.
								</Typography>
								<Typography variant="body2">
									As the weights change, there will be a
									visible change in stroke size.
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
					open={scatterHelp}
				>
					<DialogActions>
						<IconButton
							onClick={() => {
								this.setState({ scatterHelp: false });
							}}
						>
							<Close />
						</IconButton>
					</DialogActions>

					<DialogContent>
						<img src={scatterGif} alt="fitment" width="100%" />

						<Box display="flex" justifyContent="center">
							<Box marginBottom={5}>
								<Typography variant="h6">Summary</Typography>

								<Typography variant="body2">
									The black line represents the current
									predictions of the neural network.
								</Typography>

								<Typography variant="body2">
									Each gray dot is a xy coordinate that
									represents the input and input label.
								</Typography>
							</Box>
						</Box>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

export default MainTool;
