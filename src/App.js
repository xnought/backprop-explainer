/* 
  Donny Bertucci: @xnought
  Summary: 
    This file acts as the highest state and act as the controls 
    for the entire application
*/
import React, { Component } from "react";
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
import * as tf from "@tensorflow/tfjs";
import * as d3 from "d3";
import { PlayGround, ScatterPlot, Loss } from "./components/exports";
import { NeuralNetwork, tools } from "./nn/exports";
import "./App.css";
const { flatten, formatWeightArray, tensorToArray } = tools;

class App extends Component {
	constructor(props) {
		super(props);
		/* Treat the app state as the global state */
		this.state = {
			loss: null,
			duringEpoch: false,
			shape: [1, 8, 8, 1],
			epoch: 0,
			yhat: [],
			biasesData: [],
			weightsData: [],
			lr: 0.01,
			data: {
				X: [],
				y: [],
			},
			scale: 5,
			curve: "sin",
			controls: {
				playing: false,
				speed: 0,
			},
			nshow: 0,
			bshow: Infinity,
			microShow: 0,
			rects: [],
			weights: [],
			links: [],
			nn: null,
			mode: false,
			trans: null,
			macro: false,
			direction: "edgePaused",
			subEpoch: "forward",
			sliderVal: 2,
			vSliderVal: 2,
			vSliderConv: 6,
			lossArray: [],
		};

		/* Prototype: Functions Binds to "this" */
		/* Main Logic */
		this.run = this.run.bind(this);
		/* Neural Network Logic */
		this.genTensorData = this.genTensorData.bind(this);
		/* Mutators of State */
		this.mutate = this.mutate.bind(this);

		this.train = this.train.bind(this);
		this.printParameters = this.printParameters.bind(this);
		this.reset = this.reset.bind(this);
		this.asyncPause = this.asyncPause.bind(this);
		this.resetParameters = this.resetParameters.bind(this);
		this.changeModelLr = this.changeModelLr.bind(this);
		this.initNeuralNetwork = this.initNeuralNetwork.bind(this);
		this.anim = this.anim.bind(this);
	}

	anim = async () => {
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		const ms = 500;
		const l = this.state.shape.reduce((a, b) => a + b) - 1;

		this.setState({
			...this.state,
			subEpoch: "forward",
			direction: "edgeForward",
			nshow: 0,
			bshow: Infinity,
		});
		await timer(ms);

		this.setState({ nshow: 1 });
		let i = 1;
		while (this.state.nshow < l) {
			let curr = this.state.shape[i];
			await timer(ms);
			this.setState({
				nshow: (this.state.nshow += curr),
			});
			i++;
		}
		await timer(ms);
		this.setState({
			nshow: (this.state.nshow += 1),
		});
		await timer(ms);
		this.setState({
			nshow: (this.state.nshow += 1),
		});

		this.setState({ bshow: Infinity });
		/* Pause! now go backward */
		this.setState({
			...this.state,
			direction: "edgeBackward",
			subEpoch: "backward",
		});

		await timer(ms);
		this.setState({ bshow: l });

		await timer(ms);
		this.setState({ bshow: (this.state.bshow -= 1) });

		let e = this.state.shape.length - 2;
		while (this.state.bshow > 0) {
			let curr = this.state.shape[e];
			await timer(ms);
			this.setState({
				bshow: (this.state.bshow -= curr),
			});
			e--;
		}

		this.setState({ direction: "edgePaused" });
	};
	initNeuralNetwork(shape) {
		if (!this.state.controls.playing) {
			const rw = 32;
			const rh = 32;
			let xScale = d3.scaleLinear().domain([0, 100]).range([50, 750]);
			let yScale = d3.scaleLinear().domain([0, 100]).range([500, 0]);
			let start = { x: 50 - rw / 2, y: 250 - rh / 2 };
			let stop = { x: 750 - rw / 2, y: 250 - rh / 2 };
			const link = d3
				.linkHorizontal()
				.x((d) => d.x + rw / 2)
				.y((d) => d.y + rh / 2);
			/* First we figure our how to create the neurons */
			/* GIVEN A SHAPE OF [1,2,2,1] */
			const layerProportion = [0, 25, 50, 75, 0];
			let ns = [];
			let flatns = [];
			ns.push([start]);
			flatns.push(start);
			for (let layer = 1; layer < shape.length - 1; layer++) {
				let dense = [];
				for (let neuron = 0; neuron < shape[layer]; neuron++) {
					/* First generate neuron */
					let aaron = {
						x: xScale(layerProportion[layer]) - rw / 2,
						y: yScale(92 - neuron * 12) - rh / 2,
					};
					dense.push(aaron);
					flatns.push(aaron);
				}
				ns.push(dense);
			}
			flatns.push(stop);
			ns.push([stop]);

			if (this.state.mode && false) {
				/* We start to iterate over ns */
				let links = [];
				for (let layer = shape.length - 1; layer > 0; layer--) {
					let interval = -14.5;
					for (
						let prevNeuron = 0;
						prevNeuron < shape[layer - 1];
						prevNeuron++
					) {
						for (let neuron = 0; neuron < shape[layer]; neuron++) {
							links.push(
								link({
									source: {
										x: ns[layer - 1][prevNeuron].x + 15.5,
										y: ns[layer - 1][prevNeuron].y,
									},
									target: {
										x: ns[layer][neuron].x - 15,
										y: ns[layer][neuron].y + interval,
									},
								})
							);
						}
						interval += 3.5;
					}
				}

				this.setState({ rects: flatns });
				this.setState({ links });
			} else {
				/* We start to iterate over ns */
				let links = [];
				for (let layer = shape.length - 1; layer > 0; layer--) {
					let interval = -14.5;
					for (
						let prevNeuron = 0;
						prevNeuron < shape[layer - 1];
						prevNeuron++
					) {
						for (let neuron = 0; neuron < shape[layer]; neuron++) {
							links.push(
								link({
									source: ns[layer - 1][prevNeuron],
									target: ns[layer][neuron],
								})
							);
						}
						interval += 3.5;
					}
				}

				this.setState({ rects: flatns });
				this.setState({ links });
			}
		} else if (this.state.controls.playing) {
			let flattenedWeights = flatten(this.state.weightsData);
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
			await this.train(this.state.data.X, this.state.data.y);
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
			return this.state.nn;
		});
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		///* Until broken by user */
		let play = this.state.controls.playing;
		////let epoch = 0;
		while (play !== false) {
			this.setState({ duringEpoch: true });
			const { playing /* speed */ } = this.state.controls;
			play = playing;
			await model.fit(XTensor, yTensor, {
				epochs: 1,
			});
			tf.tidy(() => {
				let yhatTensor = model.predict(XTensor);
				let yhat = tensorToArray(yhatTensor);
				let loss = tf.losses.meanSquaredError(y, yhat).dataSync()[0];
				this.printParameters(model, loss, yhat, this.state.epoch + 1);
				return undefined;
			});
			this.setState({ duringEpoch: false });
			await timer(this.state.controls.speed);
		}
		this.setState({ nn: model });
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
			let X = tensorToArray(XTensor);
			let y = tensorToArray(yTensor);
			let yhat = tensorToArray(yhatTensor);
			this.setState({
				...this.state,
				data: { X, y },
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
		tf.dispose(this.state.nn);
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
			nn: model,
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
		this.setState({ nn: model });
	}
	shouldComponentUpdate() {
		if (this.state.duringEpoch) {
			return false;
		} else {
			return true;
		}
	}

	render() {
		/* Destructure State*/
		const {
			shape,
			scale,
			trans,
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
			data,
		} = this.state;
		const { playing, speed } = controls;
		const { X, y } = data;

		let newShape = [...shape];
		newShape.splice(0, 1);
		newShape.splice(newShape.length - 1, 1);
		const lrs = [0.001, 0.01, 0.1, 0.3, (1.0).toFixed(1)];
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
						await this.anim();
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
									let formattedWeights = formatWeightArray(
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
										trans: nn,
										mode: !mode,
										controls: {
											...this.state.controls,
											playing: false,
										},
									});
									await timer(1000);
									this.setState({ nshow: 1 });
									const anim = async () => {
										while (this.state.nshow < 19) {
											await timer(1000);
											this.setState({
												nshow: (this.state.nshow += 8),
											});
										}
									};
									await this.anim();
								}}
							>
								<Typography variant="h4">
									Epoch: {epoch}
								</Typography>
							</Button>
						</Tooltip>
						<Typography variant="h6">
							loss:
							{loss == null ? "" : loss.toFixed(6)}
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
									defaultValue={4}
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
				<AppBar
					position="static"
					style={{
						background: this.state.mode ? "#f50257" : "#175676",
						color: "white",
					}}
				>
					<Toolbar>
						<Typography variant="h6">
							{this.state.mode
								? "Backpropagation Visualizer"
								: "Neural Network Visualizer"}
						</Typography>
					</Toolbar>
				</AppBar>

				<Box display="flex" justifyContent="center" marginTop={10}>
					{controlCenter}
					<Box marginLeft={10}>
						<div className="regular">
							<PlayGround
								trans={trans}
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
								microShow={this.state.microShow}
								mode={mode}
								backward={this.state.direction}
								onClick={() => {
									this.asyncPause();
								}}
							></PlayGround>
						</div>
					</Box>
					{scatter}
				</Box>
			</div>
		);
	}
}

export default App;
