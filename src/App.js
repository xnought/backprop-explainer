/* 
  Donny Bertucci: @xnought
  Summary: 
	App.js is the main controller of all logic of the backprop explainer
*/

/* ****** START IMPORTS ****** */
import React, { Component } from "react";
import * as tf from "@tensorflow/tfjs";
import "./App.css";
import {
	NeuralNetworkComponent,
	ScatterPlot,
	Loss,
	Explanation,
} from "./components/exports";
import {
	Typography,
	Box,
	AppBar,
	Toolbar,
	Card,
	CardContent,
	IconButton,
	CardActions,
	Chip,
	Button,
	Fab,
	Slider,
	Tooltip,
} from "@material-ui/core";
import { Replay, SlowMotionVideo, PlayArrow, Stop } from "@material-ui/icons";
import { NeuralNetwork, tools } from "./nn/exports";
import { draw } from "./Utils/exports";
/* ****** END IMPORTS ****** */

class App extends Component {
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
			shape: [1, 4, 4, 1],
			lr: 0.01,
			epoch: 0,
			biasesData: [],
			weightsData: [],
			lossArray: [],
			loss: null,
			scale: 5,
			rects: [],
			weights: [],
			links: [],
			direction: "edgePaused",
			curve: "sin",

			/* State for Components */
			controls: {
				playing: false,
				speed: 0,
			},
			sliderVal: 2,
			mode: false,
			stopRender: false,
		};

		/* Cleaned up functions start */
		this.initNeuralNetwork = this.initNeuralNetwork.bind(this);

		/* Cleaned up functions end */

		/* Prototype: Functions Binds to "this" */
		this.run = this.run.bind(this);
		this.genTensorData = this.genTensorData.bind(this);
		this.mutate = this.mutate.bind(this);

		this.train = this.train.bind(this);
		this.printParameters = this.printParameters.bind(this);
		this.reset = this.reset.bind(this);
		this.asyncPause = this.asyncPause.bind(this);
		this.resetParameters = this.resetParameters.bind(this);
		this.changeModelLr = this.changeModelLr.bind(this);
		this.anim = this.anim.bind(this);
	}

	async anim() {}

	initNeuralNetwork(shape) {
		const { controls } = this.state;
		const { playing } = controls;

		// If we are not training the tensorflow neural network
		if (!playing) {
			/* ******START SETUP****** */
			const squareWidth = 32;
			const xConstraints = { domain: [0, 100], range: [50, 750] };
			const yConstraints = { domain: [0, 100], range: [500, 0] };
			//prettier-ignore
			const {xScale, yScale} = draw.generateLinearScale(xConstraints,yConstraints);
			// Create the starting point and the stopping point for the neural network
			const start = { x: 50 - squareWidth / 2, y: 250 - squareWidth / 2 };
			const stop = { x: 750 - squareWidth / 2, y: 250 - squareWidth / 2 };
			// generate function to create paths from (x,y) to (x,y)
			const linksGenerator = draw.generateLink(squareWidth / 2);
			// how the layers are proptioned compared to the linear scale
			const layerProportion = [0, 25, 50, 75, 0];
			/* ******END SETUP****** */

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
			const links = draw.generateLinksPlacement(
				shape,
				shapedNeurons,
				linksGenerator
			);
			/* END GENERATING THE GRAPH */

			//update the state of the links and rectangles to be rendered
			this.setState({ links, rects: flattenedNeurons });
		} else if (playing) {
			const flattenedWeights = tools.flatten(this.state.weightsData);
			//update the weights to be rendered
			this.setState({ weights: flattenedWeights });
		}
	}

	changeModelLr(lrChange) {
		tf.tidy(() => {
			this.setState({ lr: lrChange });
			return undefined;
		});
	}
	async run() {
		let playing = !this.state.controls.playing;
		this.mutate("controls", "playing", playing);
		if (playing === true) {
			await this.train(this.state.X, this.state.y);
			console.log("epic");
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
		///* Until broken by user */
		let play = this.state.controls.playing;
		////let epoch = 0;
		while (play !== false) {
			this.setState({ stopRender: true });
			const { playing /* speed */ } = this.state.controls;
			play = playing;
			await model.fit(XTensor, yTensor, {
				epochs: 1,
			});
			tf.tidy(() => {
				let yhatTensor = model.predict(XTensor);
				let yhat = tools.tensorToArray(yhatTensor);
				let loss = tf.losses.meanSquaredError(y, yhat).dataSync()[0];
				this.printParameters(model, loss, yhat, this.state.epoch + 1);
				return undefined;
			});
			this.setState({ stopRender: false });
			await timer(this.state.controls.speed);
		}
		this.setState({ tensorFlowNN: model });
		tf.dispose(XTensor);
		tf.dispose(yTensor);
	}
	async genTensorData(eqn, scaled) {
		await tf.ready();
		tf.tidy(() => {
			let XTensor = tf.linspace(-this.state.scale, this.state.scale, 50);
			let yTensor;
			yTensor = tf.mul(eqn(XTensor), scaled);
			let yhatTensor = tf.zerosLike(XTensor);
			let X = tools.tensorToArray(XTensor);
			let y = tools.tensorToArray(yTensor);
			let yhat = tools.tensorToArray(yhatTensor);
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

		let lossArray = [...this.state.lossArray, loss];
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
		await this.genTensorData(eqn, scale);
		const model = tf.tidy(() => {
			return this.modelCompile(this.state.lr);
		});
		this.setState({
			...this.state,
			epoch: 0,
			loss: null,
			weights: [],
			tensorFlowNN: model,
			lossArray: [],
		});
		tf.dispose(optimizer);
	}

	async reset(scale) {
		this.asyncPause();
		this.resetParameters(scale);
	}
	async componentDidMount() {
		tf.setBackend("cpu");
		this.genTensorData(tf.sin, this.state.scale);
		this.initNeuralNetwork(this.state.shape);
		const model = tf.tidy(() => {
			return this.modelCompile(0.01);
		});
		this.setState({ tensorFlowNN: model });
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
			links,
			weights,
			mode,
			epoch,
			curve,
			lr,
			loss,
			controls,
		} = this.state;
		const { playing, speed } = controls;

		let newShape = [...shape];
		newShape.splice(0, 1);
		newShape.splice(newShape.length - 1, 1);
		const lrs = [0.001, 0.005, 0.01, 0.05, 0.1];
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
				<Tooltip title="slomo" arrow>
					<IconButton
						style={{
							color: speed === 0 ? "grey" : "#FFC006",
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
						<SlowMotionVideo />
					</IconButton>
				</Tooltip>
			</CardActions>
		);
		const controlsBackProp = (
			<CardActions>
				<Button
					onClick={async () => {
						await this.anim(this.state.miniNN);
					}}
				>
					REPLAY
				</Button>
			</CardActions>
		);

		const controlCenter = (
			<Box width={400}>
				<Card variant="outlined">
					<CardContent>
						<Typography
							variant="caption"
							style={{
								color: "#4BA3C3",
							}}
						>
							Control Center
						</Typography>
						<div on></div>
						<Tooltip
							title={
								<Typography variant="h6">
									{this.state.mode
										? "Click to go back"
										: "Click to see Backpropagation"}
								</Typography>
							}
							arrow
							placement="right-start"
							open={this.state.loss != null}
						>
							<Button
								disabled={this.state.loss == null}
								onClick={async () => {
									const timer = (ms) =>
										new Promise((res) =>
											setTimeout(res, ms)
										);
									let formattedWeights = tools.formatWeightArray(
										weightsData,
										shape
									);
									let nn = new NeuralNetwork(
										shape,
										formattedWeights,
										biasesData
									);

									nn.forward(X[0], y[0]);
									nn.backward();
									this.setState({
										...this.state,
										miniNN: nn,
										mode: !mode,
										controls: {
											...this.state.controls,
											playing: false,
										},
									});
									await timer(1000);
									this.setState({ nshow: 1 });
									await this.anim(nn);
								}}
							>
								<Typography variant="h4">
									Epoch: {epoch}
								</Typography>
							</Button>
						</Tooltip>
						<Typography variant="h6">
							loss:
							{loss == null ? "" : loss.toPrecision(6)}
						</Typography>
						{this.state.mode ? controlsBackProp : controlsReg}
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
								Customization
							</Typography>
							<CardActions>
								<Typography variant="caption">
									Learning Rate
								</Typography>
								{lrs.map((num, i) => (
									<Chip
										disabled={playing}
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
										disabled={playing}
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
													item.scale
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
									disabled={playing}
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
									disabled={playing}
									onClick={() => {
										let a = shape;
										console.log(a.length);
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
									disabled={playing}
									onClick={() => {
										let a = shape;
										console.log(a.length);
										if (a.length > 2) {
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
					<ScatterPlot
						width={300}
						height={300}
						padding={0}
						start={-scale}
						stop={scale}
						X={X}
						y={y}
						yhat={yhat}
					/>
				</Box>
				<Box marginTop={10}>
					<Loss lossArray={this.state.lossArray} loss={loss} />
				</Box>
			</Box>
		);

		return (
			<div id="app">
				<div className="regular">
					<AppBar
						position="fixed"
						variant="outlined"
						style={{
							background: false ? "#f50257" : "#175676",
							color: "white",
						}}
					>
						<Toolbar>
							<Typography variant="h6">
								Backpropagation Explainer
							</Typography>
						</Toolbar>
					</AppBar>

					<Card
						variant="outlined"
						style={{
							background: "#FAFAFA",
							outlineColor: "white",
							paddingBottom: "1em",
						}}
					>
						<CardContent>
							<Box
								className="regular"
								display="flex"
								justifyContent="center"
								marginTop={10}
							>
								{controlCenter}
								<Box marginLeft={10}>
									<NeuralNetworkComponent
										trans={miniNN}
										input={X[0]}
										label={y[0]}
										shapedWeights={weightsData}
										shape={shape}
										biases={biasesData}
										weights={weights}
										rects={rects}
										links={links}
										playing={
											playing
												? speed === 0
													? "edgeForward"
													: "edgeSlowed"
												: "edgePaused"
										}
										show={playing}
										nshow={this.state.nshow}
										bshow={this.state.bshow}
										mode={mode}
										backward={this.state.direction}
									></NeuralNetworkComponent>
								</Box>
								{scatter}
							</Box>
						</CardContent>
					</Card>
				</div>

				<Explanation />
			</div>
		);
	}
}

export default App;
