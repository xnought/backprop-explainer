/* 
  Donny Bertucci: @xnought
  Date Created: 02/15/2021
  Summary: 
    This file acts as the highest state and act as the controls 
    for the entire application
*/
import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import PlayButton from "./components/PlayButton";

class App extends Component {
	constructor(props) {
		super(props);
		/* Treat the app state as the global state */
		this.state = {
			/* data: stores the input and lables to the input */
			data: {
				X: [],
				y: [],
			},
			/* Stores the model and model metadata */
			model: {
				neurons: [],
				shape: [],
				loss: null,
				yhat: null,
				epoch: 0,
				lr: 0.01,
			},
			/* Stores the controls */
			controls: {
				playing: false,
				speed: 50,
			},
		};

		/* Prototype: Functions Binds to "this" */
		/* Main Logic */
		this.main = this.main.bind(this);
		this.run = this.run.bind(this);
		/* Neural Network Logic */
		this.neuralNetwork = this.neuralNetwork.bind(this);
		/* Neural Network Implementation */
		this.initializeModel = this.initializeModel.bind(this);
		this.forwardModel = this.forwardModel.bind(this);
		this.backwardModel = this.backwardModel.bind(this);
		this.updateModel = this.updateModel.bind(this);

		/* Data Generation */
		this.generateData = this.generateData.bind(this);
		this.linearData = this.linearData.bind(this);
		/* Mutators of State */
		this.mutate = this.mutate.bind(this);
	}

	/* 
    Name: main
    Purpose: mutate all the values seen to user by delay of this.state.controls.speed 
    @mutate: this.state.model
  */
	async main() {
		let count = 0;
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		/* Until broken by user */
		while (true) {
			/* Destructure neccesary state */
			const { controls, model } = this.state;
			const { playing, speed } = controls;

			if (playing === false) {
				break;
			}
			await timer(speed);
			/* this.nerualNetwork(model) */
			this.mutate("model", "epoch", model.epoch + 1);
		}
	}

	/* 
    Name: start
    Purpose: start the main logic and choose to stop
    @mutate: this.state.controls.playing
  */
	async run() {
		await this.mutate("controls", "playing", !this.state.controls.playing);
		await this.main();
	}

	neuralNetwork(model) {
		this.forwardModel(model);
		this.backwardModel(model);
		this.updateModel(model);
	}

	/* 
    Name: initializeModel
    Purpose: to invoke generation of data and initializing the neural network model
    @mutate: this.model
  */
	initializeModel() {
		/* Generate Data */
		this.generateData();
		/* Update Data is State */
		/* Generate Neural Network Model */
		/* Initialize the weights and biases */
	}
	forwardModel(model) {}
	backwardModel(model) {}
	updateModel(model) {}

	/* 
    Name: generateData
    @param: equation (a function the user passes in)
    @mutate: this.data
  */
	generateData(equation) {
		if (typeof equation === "function") {
			/* Create the X input data */
			const X = this.linearData(0, 10, 1);
			/* Create the labels to the input data */
			const y = X.map((input) => {
				return equation(input);
			});
			/* Set State */
			this.mutate("data", "X", X);
			this.mutate("data", "y", y);
		} else {
			console.error(
				"Enter a valid equation: must be function with input parameter and returns a number"
			);
		}
	}

	/* 
    Name: linearData
    @param: start
    @param: end
    @param increment
    @return: output array
  */
	linearData(start, end, increment) {
		let output = [];
		for (let i = start; i <= end; i += increment) {
			output.push(i);
		}
		return output;
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
		let state = { ...this.state };
		/* If this.state.key.subkey exists */
		if (key in state && subkey in state[key]) {
			/* Mutate the state */
			state[key][subkey] = value;
			this.setState({ state });
		} else {
			console.error("Could not be found in state");
		}
	}

	componentDidMount() {
		this.generateData(Math.sin);
	}

	render() {
		/* Destructure State*/
		const { data, model, controls } = this.state;

		/* Destructuring model */
		const { epoch, loss } = model;

		/* Destructure render */
		const PlayButtonClick = (
			// eslint-disable-next-line
			<a onClick={async () => await this.run()}>
				<PlayButton playing={controls.playing} />
			</a>
		);

		return (
			<div>
				<Typography variant="h6">
					Epoch: {epoch}, Loss: {loss}
				</Typography>
				{PlayButtonClick}
			</div>
		);
	}
}

export default App;
