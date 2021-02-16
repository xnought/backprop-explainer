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
				y: null,
				yhat: null,
				epoch: 0,
				lr: 0.01,
			},
			/* Stores the controls */
			controls: {
				playing: false,
				speed: 100,
			},
		};

		/* Prototype: Functions Binds to "this" */
		/* Main Logic */
		this.main = this.main.bind(this);
		this.run = this.run.bind(this);
		/* Neural Network Logic */
		this.neuralNetwork = this.neuralNetwork.bind(this);
		/* Intialization */
		this.initDenseNeuron = this.initDenseNeuron.bind(this);
		this.initializeModel = this.initializeModel.bind(this);
		this.linkModel = this.linkModel.bind(this);
		/* Epoch calculations */
		this.forwardModel = this.forwardModel.bind(this);
		this.backwardModel = this.backwardModel.bind(this);
		this.updateModel = this.updateModel.bind(this);
		this.setInputs = this.setInputs.bind(this);
		/* Activation Functions */
		/* Tools for forward */
		/* Loss Functions */
		/* Data Generation */
		this.generateData = this.generateData.bind(this);
		this.linearData = this.linearData.bind(this);
		/* Mutators of State */
		this.mutate = this.mutate.bind(this);
		this.mutateModelNeurons = this.mutateModelNeurons.bind(this);
	}
	/* not binded to "this" functions */
	ReLU(number) {
		return Math.max(0, number);
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
    Name: main
    Purpose: mutate all the values seen to user by delay of this.state.controls.speed 
    @mutate: this.state.model
  */
	async main() {
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
			await this.neuralNetwork();
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

	async neuralNetwork() {
		await this.forwardModel();
		// await this.backwardModel(model);
		// await this.updateModel(model);
	}

	/* 
    Name: initializeModel
    Purpose: to invoke generation of data and initializing the neural network model
    @mutate: this.model
  */
	initializeModel(shape) {
		/* Generate Data and set this.state.data*/
		this.generateData(0, 4, 1, Math.sin);
		// let newsShape = [0, 1, 3, 3, 1];
		// const numLayers     1  2  3  4 = 4
		let newShape = [0, ...shape];
		const numLayers = newShape.length;

		/* Define the model */
		/* [[neuron], [neuron, neuron, neuron],[neuron, neuron, neuron], [neuron]] model: [1,3,3,1] shape */
		let model = [];

		/* Add input neuron to the model */
		for (let i = 1; i < numLayers; i++) {
			/* Initialize layer */
			let layer = [];
			/* Get the number of neurons to generate */
			let numNeurons = newShape[i];
			/* Add neurons to the to the layer */
			for (let e = 0; e < numNeurons; e++) {
				/* Number of inputs from the previous layer to devlay Neuron */
				let neuron = this.initDenseNeuron(newShape[i - 1]);
				/* Push to layer */
				layer.push(neuron);
			}
			/* Add to the model */
			model.push(layer);
		}

		/* update the state */
		this.mutate("model", "neurons", model);
		this.mutate("model", "shape", shape);
	}

	/* 
    Name: initDenseNeuron
    @param: numInputs
    @return: intialized neuron object 
  */
	initDenseNeuron(numInputs) {
		let DenseNeuronTemplate = {
			forward: {
				inputs: [],
				weights: [],
				bias: null,
				product: [],
				sum: null,
				activation: null,
				output: null,
			},
			backward: {
				dprevNeurondLoss: null,
				dActdSum: null,
				dSumdBias: null,
				dSumdMult: [],
				dMultdWeights: [],
				dMultdInputs: [],
				dthisNeurondloss: null,
			},
			links: [],
		};
		for (let i = 0; i < numInputs; i++) {
			let number = Math.random() < 0.5 ? -Math.random() : Math.random();
			//let number = Math.random();
			DenseNeuronTemplate.forward.weights.push(number);
		}
		DenseNeuronTemplate.forward.bias = 0;
		DenseNeuronTemplate.links = this.linkModel(numInputs);

		return DenseNeuronTemplate;
	}

	linkModel(numInputs) {
		return this.linearData(0, numInputs - 1, 1);
	}

	/* 
    Name: forwardModel
    Purpose: one forward pass 
    @mutate: this.model
  */
	forwardModel() {
		/* Destructure State */
		const { data, model } = this.state;
		const { neurons, shape } = model;

		/* Add the inputs to the first input neuron */
		const index = this.getRandomInt(data.X.length);
		let X = [data.X[index]];
		this.setInputs(X, 0);
		/* First perform one forward pass */
		/* iterate non-input layers */
		let io = X;
		for (let layer = 1; layer < shape.length; layer++) {
			/* Pass the values from the last neuron */
			this.setInputs(io, layer);
			io = [];
			/* iterate neuron */
			for (let neuron = 0; neuron < shape[layer]; neuron++) {
				let { weights, inputs, bias } = neurons[layer][neuron].forward;
				let mult = this.mult(weights, inputs);
				let sum = this.sum(mult) + bias;
				let relu = this.ReLU(sum);
				this.mutateModelNeurons(
					"forward",
					"product",
					mult,
					layer,
					neuron
				);
				this.mutateModelNeurons("forward", "sum", sum, layer, neuron);
				this.mutateModelNeurons(
					"forward",
					"activation",
					relu,
					layer,
					neuron
				);
				this.mutateModelNeurons(
					"forward",
					"output",
					relu,
					layer,
					neuron
				);
				io.push(relu);
			}
		}
		/* Calculate loss */
		const yhat = this.state.model.neurons[shape.length - 1][0].forward
			.output;
		let loss = this.mseLoss(yhat, data.y[index]);
		this.mutate("model", "y", data.y[index]);
		this.mutate("model", "yhat", yhat);
		this.mutate("model", "loss", loss);

		//console.log(`yhat: ${this.state.model.yhat}`);
		//console.log(`y: ${this.state.data.y[index]}`);
		//console.log(this.state.model.loss);
	}
	/* 
    Name: backwardModel
    Purpose: compute derivative backwards
    @mutate: this.model
  */
	backwardModel() {
		/* Compute Derivative of loss */
		/* Iterate backwards of neurons */
		/* Compute derivative of a neuron */
		/* print the derivatives */
	}
	/* 
    Name: updateModel
    Purpose: to perform gradient descent and update the weights
    @mutate: this.model
  */
	updateModel() {
		/* Use the derivatives to perform gradient descent */
	}
	/* 
    Name: setInputs
    @param: inputs
    @param: currentLayer
    @mutate: this.state.model.neurons[currentLayer]
  */
	setInputs(inputs, currentLayer) {
		/* Destructure the neurons */
		const { neurons } = this.state.model;
		/* Iterate through each neuron and set its inputs */
		for (let i = 0; i < neurons[currentLayer].length; i++) {
			this.mutateModelNeurons(
				"forward",
				"inputs",
				inputs,
				currentLayer,
				i
			);
		}
	}

	/* 
    Name: generateData
    @param: start
    @param: end
    @param increment
    @param: equation (a function the user passes in)
    @mutate: this.data
  */
	generateData(start, stop, increment, equation) {
		if (typeof equation === "function" && equation(start) !== undefined) {
			/* Create the X input data */
			const X = this.linearData(start, stop, increment);
			/* Create the labels to the input data */
			const y = X.map((input) => {
				return equation(input);
			});
			/* Set State */
			this.mutate("data", "X", X);
			this.mutate("data", "y", y);
		} else {
			console.error(
				"Enter a valid equation: must be function with input parameter that returns a number"
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

	/* 
    Name: mutateModelNeurons
    @param key: corresponds to this.state.key
    @param subkey: corresponds to this.state.key.subkey
    @param value
    @param layer
    @param neuron
    @mutate: this.state.key.subkey with value
  */
	mutateModelNeurons(key, subkey, value, layer, neuron) {
		/* copy of the state */
		let neurons = { ...this.state.model.neurons };
		/* If this.state.key.subkey exists */
		if (neurons[layer][neuron][key][subkey] !== undefined) {
			/* Mutate the state */
			neurons[layer][neuron][key][subkey] = value;
			this.setState({
				...this.state,
				model: { ...this.state.model, neurons: neurons },
			});
		} else {
			console.error("Could not be found in state");
		}
	}

	async componentDidMount() {
		await this.initializeModel([1, 2, 2, 1]);
		await this.neuralNetwork();
	}

	render() {
		/* Destructure State*/
		const { data, model, controls } = this.state;

		/* Destructuring model */
		const { epoch, loss, shape, neurons, yhat } = model;

		/* Destructuring of data */
		const { X, y } = data;

		/* Destructuring of model */

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
					X: [{X.toString()}], y: [{y.toString()}], Epoch: {epoch},
				</Typography>
				<Typography variant="h6">
					Model Shape: [{shape.toString()}]
				</Typography>
				<Typography variant="h6">
					y:{model.y}, yhat:{yhat}, Loss: {loss}
				</Typography>
				{PlayButtonClick}
			</div>
		);
	}
}

export default App;
