/* 
  Donny Bertucci: @xnought
  Date Created: 02/15/2021
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
} from "@material-ui/core";
import { Replay, SlowMotionVideo } from "@material-ui/icons";
import style from "./App.css";
import PlayButton from "./components/PlayButton";
import NN from "./components/NN";
import ScatterPlot from "./components/ScatterPlot";
import * as tf from "@tensorflow/tfjs";
import * as d3 from "d3";

class App extends Component {
	constructor(props) {
		super(props);
		/* Treat the app state as the global state */
		this.state = {
			/* data: stores the input and lables to the input */
			loss: null,
			duringEpoch: false,
			X: null,
			y: null,
			shape: [1, 4, 4, 1],
			epoch: 0,
			yhat: [],
			biasData: [],
			weightsData: [],
			lr: 0.1,
			data: {
				X: [],
				y: [],
			},
			scale: 5,
			/* Stores the model and model metadata */
			model: {
				seq: {},
				neurons: [],
				shape: [1, 4, 4, 1],
				loss: null,
				y: null,
				yhat: [],
				dlossdyhat: null,
				epoch: 0,
				lr: 0.01,
				curve: "sin",
				optimizer: "adam",
				scale: 5,
			},
			/* Stores the controls */
			controls: {
				playing: false,
				speed: 0,
			},
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
		this.changeModelOptimizer = this.changeModelOptimizer.bind(this);
	}
	async changeModelOptimizer(optimizerChange) {}

	changeModelLr(lrChange) {
		tf.tidy(() => {
			this.setState({ lr: lrChange });
			return undefined;
		});
	}
	/* not binded to "this" functions */
	ReLU(number) {
		return Math.max(0, number);
	}
	mseDerivative(yhat, y) {
		return 2 * (yhat - y);
	}
	mseLoss(yhat, y) {
		return Math.pow(yhat - y, 2);
	}
	mult(array1, array2) {
		return array1.map((item, i) => {
			return item * array2[i];
		});
	}
	sum(array) {
		return array.reduce((a, b) => a + b);
	}
	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	/* 
    Name: start
    Purpose: start the main logic and choose to stop
    @mutate: this.state.controls.playing
  */
	async run() {
		let playing = !this.state.controls.playing;
		this.mutate("controls", "playing", playing);
		if (playing === true) {
			await this.train(this.state.data.X, this.state.data.y);
			//tf.tidy(() => {
			//tf.tensor([1, 2, 3]).print();
			//return undefined;
			//});
		}
		//await this.main();
	}

	/* 
    Name: mutate
    @param key: corresponds to this.state.key
    @param subkey: corresponds to this.state.key.subkey
    @param value
    @mutate: this.state.key.subkey with value
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

	tensorToArray(tensor) {
		return Array.from(tensor.dataSync());
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
	modelCompile(optimizer, lr) {
		let model = tf.sequential();
		this.addModel(model);
		model.compile({
			optimizer: optimizer(lr),
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

		const model = this.modelCompile(tf.train.adam, this.state.lr);
		this.setState({ epoch: 0 });
		//await model.fit(X, y, { epochs: 1000 });
		//model.predict(X);
		//console.log(yArr);
		//console.log(XArr);
		//const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		/* Until broken by user */
		let play = this.state.controls.playing;
		//let epoch = 0;
		while (play !== false) {
			let a = performance.now();
			/* Destructure neccesary state */
			const { playing /* speed */ } = this.state.controls;
			//const { epoch } = this.state.model;
			play = playing;
			//this.setState({ duringEpoch: true });
			//this.mutate("model", "epoch", epoch + 1);
			//while(playing) {
			let t0 = performance.now();
			await model.fit(XTensor, yTensor, {
				epochs: 1,
			});
			let t1 = performance.now();
			console.log(`FIT SPEED: ${t1 - t0}`);
			//}

			tf.tidy(() => {
				let yhatTensor = model.predict(XTensor);
				let yhat = this.tensorToArray(yhatTensor);
				let loss = tf.losses.meanSquaredError(y, yhat).dataSync()[0];
				this.printParameters(model, loss, yhat, this.state.epoch + 1);
				//this.setState({
				////model: {
				////...this.state.model,
				////yhat,
				////loss,
				////epoch: this.state.model.epoch + 1,
				////},
				//});
				let b = performance.now();
				console.log(`SPEED: ${b - a}`);
				console.log(`epoch: ${this.state.model.epoch}`);
				return undefined;
			});
		}
		tf.dispose(model);
		tf.dispose(XTensor);
		tf.dispose(yTensor);
		console.table(tf.memory());
	}
	async genTensorData(eqn, scaled) {
		await tf.ready();
		tf.tidy(() => {
			let XTensor = tf.linspace(-this.state.scale, this.state.scale, 50);
			let yTensor;
			yTensor = tf.mul(eqn(XTensor), scaled);
			let yhatTensor = tf.zerosLike(XTensor);
			let X = this.tensorToArray(XTensor);
			let y = this.tensorToArray(yTensor);
			let yhat = this.tensorToArray(yhatTensor);
			this.setState({
				...this.state,
				data: { X, y },
				yhat,
			});
			return undefined;
		});
	}
	printParameters(model, loss, yhat, epoch) {
		let a = performance.now();
		let weightsData = [];
		let biasesData = [];
		for (let i = 0; i < model.getWeights().length; i++) {
			(i % 2 === 0 ? weightsData : biasesData).push(
				Array.from(model.getWeights()[i].dataSync())
			);
		}

		this.setState({ weightsData, loss, yhat, epoch });
		let b = performance.now();
		console.log(`PRINT SPEED: ${b - a}`);
		//for (let layer = 1; layer < model.layers.length; layer++) {
		//console.log(`Layer: ${layer} `);
		//model.layers[layer].getWeights()[0].print();

		//model.layers[layer].getWeights()[1].print();
		//}
	}
	async asyncPause() {
		this.mutate("controls", "playing", false);
	}
	async resetParameters(scale) {
		let eqn;
		let optimizer;
		if (this.state.model.curve === "sin") {
			eqn = tf.sin;
		} else if (this.state.model.curve === "tanh") {
			eqn = tf.tanh;
		} else if (this.state.model.curve === "cos") {
			eqn = tf.cos;
		}
		if (this.state.model.optimizer === "adam") {
			optimizer = tf.train.adam;
		} else if (this.state.model.optimizer === "sgd") {
			optimizer = tf.train.sgd;
		}
		await this.genTensorData(eqn, scale);
		this.setState({
			...this.state,
			epoch: 0,
			loss: null,
		});
		tf.dispose(optimizer);
	}

	async reset(scale) {
		this.asyncPause();
		this.resetParameters(scale);
		//;this.mutate("model", "seq", model);
		//;this.setState({ yhat: [] });
		//;this.mutate("model", "epoch", 0);
	}
	async componentDidMount() {
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
		const { model, controls } = this.state;

		/* Destructuring model */
		const { epoch, loss } = model;
		let shape = this.state.shape;

		let newShape = [...shape];
		newShape.splice(0, 1);
		newShape.splice(newShape.length - 1, 1);
		//console.log(newShape);
		const lrs = [0.001, 0.01, 0.1, 0.3, (1.0).toFixed(1)];
		const optimizers = ["adam", "sgd"];
		const dataSets = [
			{ label: "sin", eqn: tf.sin, scale: 5 },
			{ label: "cos", eqn: tf.cos, scale: 5 },
			{ label: "tanh", eqn: tf.tanh, scale: 5 },
		];

		/* Destructuring of model */

		/* Destructure render */
		const PlayButtonClick = (
			// eslint-disable-next-line
			<a
				onClick={async () => {
					await this.run();
				}}
			>
				<PlayButton playing={controls.playing} />
			</a>
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
					<Box width={400}>
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
									Epoch: {this.state.epoch}
								</Typography>
								<Typography variant="h6">
									loss:{" "}
									{this.state.loss == null
										? ""
										: this.state.loss.toFixed(6)}
								</Typography>
								<CardActions>
									<IconButton
										disabled={this.state.controls.playing}
										onClick={() => {
											this.reset(model.scale);
										}}
									>
										<Replay />
									</IconButton>
									{PlayButtonClick}
									<IconButton
										style={{
											color:
												this.state.controls.speed === 0
													? "grey"
													: "#FFC006",
										}}
										onClick={() => {
											this.mutate(
												"controls",
												"speed",
												this.state.controls.speed === 0
													? 100
													: 0
											);
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
											Optimizer
										</Typography>
										{optimizers.map((optimizer, i) => (
											<Chip
												disabled={
													this.state.controls.playing
												}
												key={i}
												label={optimizer}
												color={
													this.state.model
														.optimizer === optimizer
														? "secondary"
														: "default"
												}
												onClick={() => {
													this.mutate(
														"model",
														"optimizer",
														optimizer
													);
													let a = tf.train.sgd;
													let b = tf.train.adam;
													this.changeModelOptimizer(
														optimizer === "sgd"
															? a
															: b
													);
													tf.dispose(a);
													tf.dispose(b);
													this.reset(model.scale);
												}}
											></Chip>
										))}
									</CardActions>
									<CardActions>
										<Typography variant="caption">
											Learning Rate
										</Typography>
										{lrs.map((num, i) => (
											<Chip
												key={i}
												label={`${num}`}
												color={
													this.state.lr === `${num}`
														? "secondary"
														: "default"
												}
												onClick={() => {
													tf.tidy(() => {
														this.changeModelLr(num);
														return;
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
												disabled={
													this.state.controls.playing
												}
												key={i}
												label={item.label}
												color={
													this.state.model.curve ===
													item.label
														? "secondary"
														: "default"
												}
												onClick={() => {
													this.setState({ shape });
													this.reset(model.scale);
													this.mutate(
														"model",
														"curve",
														item.label
													);
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
																shape[e] === 0
																	? shape[e]
																	: shape[e] -
																	  1;
															if (
																!shape[e] === 0
															) {
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
															let shape =
																model.shape;
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
																	this.mutate(
																		"model",
																		"shape",
																		shape
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
											</Box>
										))}

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
															this.mutate(
																"model",
																"shape",
																shape
															);
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
					</Box>
					<Box marginLeft={10}>
						<ScatterPlot
							width={300}
							height={300}
							padding={0}
							start={-this.state.model.scale}
							stop={this.state.model.scale}
							X={this.state.data.X}
							y={this.state.data.y}
							yhat={this.state.yhat}
						/>
					</Box>
				</Box>
				<Button
					onClick={() => {
						console.table(tf.memory());
					}}
				>
					MEM
				</Button>
			</div>
		);
	}
}

export default App;
