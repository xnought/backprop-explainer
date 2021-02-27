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
} from "@material-ui/core";
import { Replay, SlowMotionVideo, PlayArrow, Stop } from "@material-ui/icons";
import * as tf from "@tensorflow/tfjs";
import * as d3 from "d3";
import { PlayGround, ScatterPlot } from "./components/exports";
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
			lr: 0.1,
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
			rects: [],
			weights: [],
			links: [],
			nn: null,
			mode: false,
			trans: null,
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
	}

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

			/* We start to iterate over ns */
			let links = [];
			for (let layer = shape.length - 1; layer > 0; layer--) {
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
				}
			}
			this.setState({ rects: flatns });
			this.setState({ links });
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
<<<<<<< HEAD
			await model.fit(XTensor, yTensor, {
=======
			//this.setState({ duringEpoch: true });
			//this.mutate("model", "epoch", epoch + 1);
			//while(playing) {
			let t0 = performance.now();
			const h = await model.fit(XTensor, yTensor, {
>>>>>>> 24679ac9fc4ea045e036183f63d3acda6169daae
				epochs: 1,
			});
			tf.tidy(() => {
				let yhatTensor = model.predict(XTensor);
<<<<<<< HEAD
				let yhat = tensorToArray(yhatTensor);
				let loss = tf.losses.meanSquaredError(y, yhat).dataSync()[0];
=======
				let yhat = this.tensorToArray(yhatTensor);
				let loss = h.history.loss[0]; //tf.losses.meanSquaredError(y, yhat).dataSync()[0];
>>>>>>> 24679ac9fc4ea045e036183f63d3acda6169daae
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

		this.setState({ biasesData, weightsData, loss, yhat, epoch });
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
		});
		tf.dispose(optimizer);
	}

	async reset(scale) {
		this.asyncPause();
		this.resetParameters(scale);
	}
	async componentDidMount() {
<<<<<<< HEAD
		tf.setBackend("cpu");
		this.genTensorData(tf.sin, this.state.scale);
		this.initNeuralNetwork(this.state.shape);
		const model = tf.tidy(() => {
			return this.modelCompile(0.01);
		});
		this.setState({ nn: model });
=======
		/* First lets choose the data */
		//document.body.style.zoom = "75%";
		this.genTensorData(tf.sin, this.state.model.scale);
		//let model = this.modelCompile(tf.train.adam, this.state.model.lr);
		//this.mutate("model", "seq", model);
		//this.printParameters(model);
		//tf.dispose(model);
	}
	componentDidUpdate() {
		//console.table(tf.memory());
		console.log(this.state.shape);
>>>>>>> 24679ac9fc4ea045e036183f63d3acda6169daae
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
			<Fab color="secondary" onClick={() => this.run()}>
				{!playing ? <PlayArrow /> : <Stop />}
			</Fab>
		);

		return (
			<div id="app">
				<AppBar
					position="static"
					style={{ background: "#f50257", color: "white" }}
				>
					<Toolbar>
						<Typography variant="h6">
							Backpropagation Visualizer
						</Typography>
					</Toolbar>
				</AppBar>

				<Box display="flex" justifyContent="center" marginTop={10}>
					<Box
						width={400}
						className={mode ? "backpropmode" : "regular"}
					>
						<Card variant="outlined">
							<CardContent>
								<Typography
									variant="caption"
									style={{
										color: "rgb(245, 2, 87, 0.5)",
									}}
								>
									Control Center
								</Typography>
								<Typography variant="h4">
									Epoch: {epoch}
								</Typography>
								<Typography variant="h6">
									loss:
									{loss == null ? "" : loss.toFixed(6)}
								</Typography>
								<CardActions>
									<IconButton
										disabled={playing}
										onClick={() => {
											this.reset(scale);
										}}
									>
										<Replay />
									</IconButton>
									{PlayButtonClick}
									<IconButton
										style={{
											color:
												speed === 0
													? "grey"
													: "#FFC006",
										}}
										onClick={() => {
											this.setState({
												controls: {
													...controls,
													speed:
														speed === 0 ? 100 : 0,
												},
											});
										}}
									>
										<SlowMotionVideo />
									</IconButton>
								</CardActions>
							</CardContent>
						</Card>

						<Box marginTop={5}>
							<Card variant="outlined">
								<CardContent>
									<Typography
										variant="caption"
										style={{
											color: "rgb(245, 2, 87, 0.5)",
										}}
									>
										Model Initialization
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
												color={
<<<<<<< HEAD
													lr === num
=======
													this.state.lr === num
>>>>>>> 24679ac9fc4ea045e036183f63d3acda6169daae
														? "secondary"
														: "default"
												}
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
												color={
													curve === item.label
														? "secondary"
														: "default"
												}
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
								</CardContent>
							</Card>
						</Box>
					</Box>
					<Box marginLeft={10}>
<<<<<<< HEAD
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
								mode={mode}
								onClick={() => {
									this.asyncPause();
								}}
							>
								<Card
									variant="outlined"
									style={{ minWidth: 875 }}
								>
									<Box justifyContent="start" display="flex">
										<CardActions>
											<Box marginRight={11.5}>
												<Button color="secondary">
													Add Layer
												</Button>
=======
						<NN
							weights={this.state.weightsData}
							biases={this.state.biasData}
							shape={this.state.shape}
							playing={this.state.controls.playing}
							slowed={this.state.controls.speed !== 0}
						>
							<Card variant="outlined" style={{ minWidth: 875 }}>
								<Box justifyContent="start" display="flex">
									<CardActions>
										<Box marginRight={11.5}>
											<Button
												color="secondary"
												onClick={() => {
													let shape = this.state
														.shape;
													if (!(shape.length > 4)) {
														tf.tidy(() => {
															shape.splice(
																shape.length - 1
															);
															shape.push(2);
															shape.push(1);
															d3.select("#app")
																.select("#nn")
																.select("svg")
																.selectAll(
																	"path"
																)
																.remove();
															d3.select("#app")
																.select("#nn")
																.select("svg")
																.selectAll(
																	"rect"
																)
																.remove();
															this.setState({
																shape,
															});
															this.reset(
																model.scale
															);
														});
													}
												}}
											>
												Add Layer
											</Button>
										</Box>
										{newShape.map((num, i) => (
											<Box key={i} marginRight={17}>
												<Box marginBottom={1}>
													<Chip
														label={"–"}
														onClick={() => {
															let shape = this
																.state.shape;
															let e = i + 1;
															shape[e] =
																shape[e] === 1
																	? shape[e]
																	: shape[e] -
																	  1;
															if (shape[e] > 0) {
																tf.tidy(() => {
																	d3.select(
																		"#app"
																	)
																		.select(
																			"#nn"
																		)
																		.select(
																			"svg"
																		)
																		.selectAll(
																			"path"
																		)
																		.remove();
																	d3.select(
																		"#app"
																	)
																		.select(
																			"#nn"
																		)
																		.select(
																			"svg"
																		)
																		.selectAll(
																			"rect"
																		)
																		.remove();
																	this.setState(
																		{
																			shape,
																		}
																	);
																	this.reset(
																		model.scale
																	);
																	return undefined;
																});
															}
														}}
													></Chip>
												</Box>
												<Box>
													<Chip
														label={"+"}
														onClick={() => {
															let shape = this
																.state.shape;
															let e = i + 1;
															shape[e] =
																shape[e] >= 8
																	? shape[e]
																	: shape[e] +
																	  1;
															if (shape[i] <= 8) {
																tf.tidy(() => {
																	d3.select(
																		"#app"
																	)
																		.select(
																			"#nn"
																		)
																		.select(
																			"svg"
																		)
																		.selectAll(
																			"path"
																		)
																		.remove();
																	d3.select(
																		"#app"
																	)
																		.select(
																			"#nn"
																		)
																		.select(
																			"svg"
																		)
																		.selectAll(
																			"rect"
																		)
																		.remove();
																	this.setState(
																		{
																			shape,
																		}
																	);
																});
															}
														}}
													></Chip>
												</Box>
>>>>>>> 24679ac9fc4ea045e036183f63d3acda6169daae
											</Box>
											{newShape.map((num, i) => (
												<Box key={i} marginRight={17}>
													<Box marginBottom={1}>
														<Chip
															label={"–"}
														></Chip>
													</Box>
													<Box>
														<Chip
															label={"+"}
														></Chip>
													</Box>
												</Box>
											))}

<<<<<<< HEAD
											<Box>
												<Button color="secondary">
													Remove Layer
												</Button>
											</Box>
										</CardActions>
									</Box>
								</Card>
							</PlayGround>
						</div>
=======
										<Box>
											<Button
												color="secondary"
												onClick={() => {
													tf.tidy(() => {
														let shape = model.shape;
														if (shape.length > 2) {
															shape.splice(
																shape.length - 1
															);
															shape.splice(
																shape.length - 1
															);
															shape.push(1);
															d3.select("#app")
																.select("#nn")
																.select("svg")
																.selectAll(
																	"path"
																)
																.remove();
															d3.select("#app")
																.select("#nn")
																.select("svg")
																.selectAll(
																	"rect"
																)
																.remove();
															this.setState({
																shape,
															});
															this.reset(
																model.scale
															);
															return undefined;
														}
													});
												}}
											>
												Remove Layer
											</Button>
										</Box>
									</CardActions>
								</Box>
							</Card>
						</NN>
>>>>>>> 24679ac9fc4ea045e036183f63d3acda6169daae
					</Box>
					<Box marginLeft={10}>
						<div className={mode ? "backpropmode" : "regular"}>
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
						</div>
					</Box>
				</Box>
				<Button
					onClick={() => {
						let a = shape;
						a[a.length - 1] = 2;
						a.push(1);
						this.setState({ shape: a });
						this.initNeuralNetwork(a);
						this.reset(scale);
					}}
				>
					ADD LAYER
				</Button>
				<Button
					onClick={() => {
						console.table(tf.memory());
					}}
				>
					MEM
				</Button>
				<Button
					onClick={() => {
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
						console.log(weightsData);
						console.log(`label: ${this.state.yhat[0]}`);
						nn.backward();
						this.setState({ trans: nn, mode: !mode });
					}}
					variant="contained"
					color="secondary"
				>
					EPOCH MODE {mode ? "true" : "false"}
				</Button>
			</div>
		);
	}
}

export default App;
