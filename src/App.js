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
	Input,
	Box,
	AppBar,
	Toolbar,
	Card,
	CardContent,
	IconButton,
	CardActions,
	Chip,
	TextField,
	Button,
} from "@material-ui/core";
import { PlusOne, Replay, SlowMotionVideo, Add } from "@material-ui/icons";
import style from "./App.css";
import PlayButton from "./components/PlayButton";
import NN from "./components/NN";
import ScatterPlot from "./components/ScatterPlot";
import * as tf from "@tensorflow/tfjs";
import * as d3 from "d3";
import { dispose, tidy } from "@tensorflow/tfjs";

class App extends Component {
	constructor(props) {
		super(props);
		/* Treat the app state as the global state */
		this.state = {
			/* data: stores the input and lables to the input */
			duringEpoch: false,
			X: null,
			y: null,
			yhat: [],
			biasData: [],
			weightsData: [],
			data: {
				X: [],
				y: [],
			},
			/* Stores the model and model metadata */
			model: {
				seq: {},
				neurons: [],
				shape: [1, 6, 6, 1],
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
		this.genTensorData = this.genTensorData.bind(this);
		this.linearData = this.linearData.bind(this);
		/* Mutators of State */
		this.mutate = this.mutate.bind(this);
		this.mutateModelNeurons = this.mutateModelNeurons.bind(this);
		this.passBack = this.passBack.bind(this);

		this.mutateAllBackward = this.mutateAllBackward.bind(this);
		this.train = this.train.bind(this);
		this.printParameters = this.printParameters.bind(this);
		this.reset = this.reset.bind(this);
		this.asyncPause = this.asyncPause.bind(this);
		this.resetParameters = this.resetParameters.bind(this);
		this.changeModelLr = this.changeModelLr.bind(this);
		this.changeModelOptimizer = this.changeModelOptimizer.bind(this);
	}
	async changeModelOptimizer(optimizerChange) {
		let model = await this.modelCompile(
			optimizerChange,
			this.state.model.lr
		);
		this.mutate("model", "seq", model);
	}

	changeModelLr(lrChange) {
		tf.tidy(() => {
			let model = this.state.model.seq;
			model.optimizer_.learningRate = lrChange;
			this.mutate("model", "seq", model);
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
		this.mutate("controls", "playing", !this.state.controls.playing);
		await this.train(this.state.X, this.state.y);
		//await this.main();
	}

	async neuralNetwork() {
		/* Add the inputs to the first input neuron */
		await this.forwardModel(this.getRandomInt(this.state.data.X.length));
		await this.backwardModel();
		await this.updateModel();
		// await this.backwardModel(model);
		// await this.updateModel(model);
	}

	/* 
    Name: initializeModel
    Purpose: to invoke generation of data and initializing the neural network model
    @mutate: this.model
  */
	async initializeModel(shape, start, stop, increment, eqn) {
		/* Generate Data and set this.state.data*/
		this.generateData(start, stop, increment, eqn);
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
				dvalue: null,
				dReLU: null,
				dBias: null,
				dMult: [],
				dWeights: [],
				dInputs: [],
				dNeuron: null,
			},
			links: [],
		};
		for (let i = 0; i < numInputs; i++) {
			let number =
				0.1 * (Math.random() < 0.5 ? -Math.random() : Math.random());
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
	async forwardModel(index) {
		/* Destructure State */
		const { data, model } = this.state;
		const { neurons, shape } = model;

		//const index = 1;
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
				if (layer != shape.length - 1) {
					let relu = this.ReLU(sum);
				}
				let relu = sum;
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
		Name: mutateAllBackward
		@mutate: this.model.neurons[layer][neuron].backward
	*/
	mutateAllBackward(
		dReLU,
		dBias,
		dMult,
		dWeights,
		dInputs,
		dNeuron,
		layer,
		neuron
	) {
		this.mutateModelNeurons("backward", "dReLU", dReLU, layer, neuron);
		this.mutateModelNeurons("backward", "dBias", dBias, layer, neuron);
		this.mutateModelNeurons("backward", "dMult", dMult, layer, neuron);
		this.mutateModelNeurons(
			"backward",
			"dWeights",
			dWeights,
			layer,
			neuron
		);
		this.mutateModelNeurons("backward", "dInputs", dInputs, layer, neuron);
		this.mutateModelNeurons("backward", "dNeuron", dNeuron, layer, neuron);
	}

	passBack(dvalue, currentLayer) {
		const { shape } = this.state.model;
		const prevLayer = currentLayer - 1;
		for (let neuron = 0; neuron < shape[prevLayer]; neuron++) {
			this.mutateModelNeurons(
				"backward",
				"dvalue",
				dvalue,
				prevLayer,
				neuron
			);
		}
	}
	/* 
    Name: backwardModel
    Purpose: compute derivative backwards
    @mutate: this.model
  */
	async backwardModel() {
		/* Destructure the state */
		const { model } = this.state;

		/* Destructure model */
		const { yhat, y, shape } = model;

		let outputLayerIndex = shape.length - 1;
		/* Calculate the loss derivative and pass it to the output neuron */
		let dyhat = this.mseDerivative(yhat, y);
		this.mutateModelNeurons(
			"backward",
			"dvalue",
			dyhat,
			outputLayerIndex,
			0
		);

		/* calculate each layer until we hit the layer before input layer */
		for (let layer = outputLayerIndex; layer > 0; layer--) {
			let dNeurons = [];
			let dNeuronsSum = 0;
			for (let neuron = 0; neuron < shape[layer]; neuron++) {
				/* Destructure neccesary items from model forward and backward per neuron */
				let { backward, forward } = model.neurons[layer][neuron];
				let { inputs, weights, activation } = forward;
				let { dvalue } = backward;

				let dReLU = Math.max(0, activation) * dvalue;
				let dBias = dReLU;
				if (layer == outputLayerIndex) {
					dReLU = dvalue;
				}
				let dMult = inputs.map(() => dReLU);
				let dWeights = this.mult(inputs, dMult);
				let dInputs = this.mult(weights, dMult);
				let dNeuron = this.sum(dInputs);

				/* Add all to the state of the neuron */
				this.mutateAllBackward(
					dReLU,
					dBias,
					dMult,
					dWeights,
					dInputs,
					dNeuron,
					layer,
					neuron
				);

				/* Then we want to add dNeuron to an array */
				dNeurons.push(dNeuron);
				//console.log(`Layer: ${layer}, Neuron: ${neuron}`);
				//console.log(backward);
				//console.log(forward);
			}
			/* Sum the dNeuron array */
			dNeuronsSum = this.sum(dNeurons);
			/* Pass back the sum to the next layer */
			this.passBack(dNeuronsSum, layer);
		}
		//console.log(this.state.model.neurons);

		/* Given current layer I want to pass back to previous layer */
		//this.passBack(dvalue, layer);
		//console.log(neurons[layer - 1]);

		///* Start at last layer */
		//for(let layer = shape.length - 1; layer >= 0; layer-- )
		//{
		//let dNeuronArray = [];
		//let dvalueSumLayer = 0;
		///* Itererate through each neuron per layer */
		//for(let neuron = 0; neuron < shape[layer]; neuron++) {
		///* Destructure Neuron */
		//let { activation, weights, inputs } = neurons[layer][neuron].forward;
		//let inputLength = inputs.length;

		//}
		//}

		///* Destructure Neuron */
		//let { activation, weights, inputs } = neurons[layer][neuron].forward;
		//let inputLength = inputs.length;

		//let lastNeuron = neurons[layer][neuron];
		///* Calculate the loss derivative */
		//let dyhat = this.mseDerivative(yhat, y);

		///* Sum the values needed to pass back */
		//let dNeuronArray = [];
		//let dvalueNextLayer = 0;

		///* Pass the value back*/
		//let dvalue = dyhat;
		//let dReLU = Math.max(0, activation) * dvalue;
		//let dBias = dReLU;
		//let dMult = inputs.map(() => dReLU);
		//let dWeights = this.mult(inputs, dMult);
		//let dInputs = this.mult(weights, dMult);
		//let dNeuron = this.sum(dInputs);
		///* Add dNeuron to the layers output */
		//dNeuronArray.push(dNeuron);

		///* At the end of first loop of layer iteration */
		//dvalueNextLayer = this.sum(dNeuronArray);

		//console.log(lastNeuron);
		///* Pass the derivative input back */
		//this.mutateAllBackward(
		//dvalue,
		//dReLU,
		//dBias,
		//dMult,
		//dWeights,
		//dInputs,
		//dNeuron,
		//layer,
		//neuron
		//);
		/* Update all of the parameters */
		//console.log(`dinput: ${dvalue}`);
		//console.log(`Activation: ${activation}`);
		//console.log(`dReLU: ${dReLU}`);
		//console.log(`DBias: ${dBias}`);
		//console.log(`DMult: [${dMult.toString()}]`);
		//console.log(`Dweights: [${dWeights.toString()}]`);
		//console.log(`Dinputs: [${dInputs.toString()}]`);
		//this.mutateModelNeurons(
		//"backward",
		//"dprevNeurondLoss",
		//dlossdyhat,
		//shape.length - 1,
		//0
		//);

		/* Pass back to neurons based on linkage */
		/* We want to now pass it back to the last neuron */

		/* Compute Derivative of loss */
		/* Iterate backwards of neurons */
		/* Compute derivative of a neuron */
		/* print the derivatives */
	}

	gradientDescent(lr, param, dparam) {
		return param - lr * dparam;
	}
	/* 
    Name: updateModel
    Purpose: to perform gradient descent and update the weights
    @mutate: this.model
  */
	async updateModel() {
		/* Destructuring the state */
		const { model } = this.state;

		const { shape, lr, neurons } = model;
		/* Use the derivatives to perform gradient descent */
		/* Iterate through each and subtract weights by itself times the derivative of weights or biases */
		for (let layer = 1; layer < shape.length; layer++) {
			for (let neuron = 0; neuron < shape[layer]; neuron++) {
				let { weights, bias } = neurons[layer][neuron].forward;
				let { dWeights, dBias } = neurons[layer][neuron].backward;
				//*  */console.log(`Layer ${layer}, Neuron: ${neuron}`);
				/* Update weights */
				let updatedWeights = [];
				for (let weight = 0; weight < shape[layer - 1]; weight++) {
					updatedWeights.push(
						this.gradientDescent(
							lr,
							weights[weight],
							dWeights[weight]
						)
					);
				}
				/* Update bias */
				let updatedBias = this.gradientDescent(lr, bias, dBias);

				/* Update the model weights and biases */
				this.mutateModelNeurons(
					"forward",
					"weights",
					updatedWeights,
					layer,
					neuron
				);
				this.mutateModelNeurons(
					"forward",
					"bias",
					updatedBias,
					layer,
					neuron
				);
			}
		}
		/* We want to start from the beginning and subt */
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
				return equation(input).toFixed(3);
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
	predicitons() {
		const { data } = this.state;
		for (let i = 0; i < data.X.length; i++) {
			this.forwardModel();
		}
	}

	tensorToArray(tensor) {
		return Array.from(tensor.dataSync());
	}

	async addModel(model) {
		return tf.tidy(() => {
			let shape = this.state.model.shape;
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
	async modelCompile(optimizer, lr) {
		let model = tf.sequential();
		await this.addModel(model);
		model.compile({
			optimizer: optimizer(lr),
			loss: "meanSquaredError",
		});
		return model;
	}
	async train(X, y) {
		let { model } = this.state.model.seq;
		//await model.fit(X, y, { epochs: 1000 });
		//model.predict(X);
		//console.log(yArr);
		//console.log(XArr);
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		/* Until broken by user */
		let play = this.state.controls.playing;
		while (play !== false) {
			/* Destructure neccesary state */
			const { playing, speed } = this.state.controls;
			const { epoch } = this.state.model;
			play = playing;
			this.setState({ duringEpoch: true });
			this.mutate("model", "epoch", epoch + 1);
			const h = await model.fit(X, y, {
				epochs: 1,
			});
			await this.printParameters(model);
			let yhat = model.predict(X);
			this.mutate("model", "loss", h.history.loss[0]);
			this.mutate("model", "yhat", this.tensorToArray(yhat));
			this.setState({ duringEpoch: false });
			await timer(speed);
			/* this.nerualNetwork(model) */
		}
	}
	async genTensorData(eqn, scaled) {
		await tf.ready();
		let XTensor = tf.linspace(
			-this.state.model.scale,
			this.state.model.scale,
			60
		);
		let yTensor;
		yTensor = tf.mul(eqn(XTensor), scaled);
		let yhatTensor = tf.zerosLike(XTensor);
		let X = this.tensorToArray(XTensor);
		let y = this.tensorToArray(yTensor);
		let yhat = this.tensorToArray(yhatTensor);

		this.setState({
			...this.state,
			X: XTensor,
			y: yTensor,
			data: { X, y },
			model: { ...this.state.model, yhat },
		});
	}
	async printParameters(model) {
		let weightSet = [];
		let biasSet = [];
		for (let i = 0; i < model.getWeights().length; i++) {
			(i % 2 == 0 ? weightSet : biasSet).push(
				Array.from(model.getWeights()[i].dataSync())
			);
		}
		//console.log(model.layers[2].getWeights()[1].dataSync());
		this.setState({
			...this.state,
			biasData: biasSet,
			weightsData: weightSet,
		});
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
		if (this.state.model.optimizer == "adam") {
			optimizer = tf.train.adam;
		} else if (this.state.model.optimizer == "sgd") {
			optimizer = tf.train.sgd;
		}
		await this.genTensorData(eqn, scale);
		let model = await this.modelCompile(optimizer, this.state.model.lr);
		await this.printParameters(model);
		this.setState({
			...this.state,
			model: { ...this.state.model, seq: model, epoch: 0, loss: null },
		});
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

		tf.tidy(() => {
			this.genTensorData(tf.sin, this.state.model.scale);
			return undefined;
		});
		let model = await this.modelCompile(tf.train.adam, this.state.model.lr);
		tf.tidy(() => {
			this.mutate("model", "seq", model);
			this.printParameters(model);
		});
		//model.optimizer_ = tf.train.sgd(0.1);
		//model.optimizer_.learningRate = 0.001;

		//const paths = d3
		//.select("#app")
		//.select("#nn")
		//.selectAll("path")
		//.attr("class", "edge");
		//epochs: 10,
		//});
		//console.log(this.tensorToArray(model.predict(X)));
		//function lin(x) {
		//return x;
		//}
		//await this.initializeModel([1, 2, 2, 1], 0, 3.14, 1.57, Math.sin);
		//console.log(this.state.model.neurons);
		//await this.forwardModel();
		////console.log("Foward Pass");
		////console.log(this.state.model.neurons);
		////console.log("Backward Pass and Update");
		//await this.backwardModel();
		//await this.updateModel();
		//console.log(this.state.model.neurons);
		//await this.forwardModel();
		//console.log("Foward Pass");
		//console.log(this.state.model.neurons);
		//console.log("Backward Pass and Update");
		//await this.backwardModel();
		//await this.updateModel();
		//console.log(this.state.model.neurons);
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
		const { epoch, loss, shape } = model;

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
									Epochs: {epoch}
								</Typography>
								<Typography variant="h6">
									loss: {loss == null ? "" : loss.toFixed(6)}
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
												this.state.controls.speed == 0
													? "grey"
													: "#FFC006",
										}}
										onClick={() => {
											this.mutate(
												"controls",
												"speed",
												this.state.controls.speed == 0
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
														.optimizer == optimizer
														? "secondary"
														: "default"
												}
												onClick={() => {
													tf.tidy(() => {
														this.mutate(
															"model",
															"optimizer",
															optimizer
														);
														this.changeModelOptimizer(
															optimizer == "sgd"
																? tf.train.sgd
																: tf.train.adam
														);
														this.reset(model.scale);

														return undefined;
													});
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
													this.state.model.lr ==
													`${num}`
														? "secondary"
														: "default"
												}
												onClick={() => {
													tf.tidy(() => {
														this.mutate(
															"model",
															"lr",
															num
														);
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
													this.state.model.curve ==
													item.label
														? "secondary"
														: "default"
												}
												onClick={() => {
													this.mutate(
														"model",
														"shape",
														shape
													);
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
							shape={this.state.model.shape}
							playing={this.state.controls.playing}
							slowed={this.state.controls.speed != 0}
						>
							<Card variant="outlined" style={{ minWidth: 875 }}>
								<Box justifyContent="start" display="flex">
									<CardActions>
										<Box marginRight={11.5}>
											<Button
												color="secondary"
												onClick={() => {
													let shape = model.shape;
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
															this.mutate(
																"model",
																"shape",
																shape
															);
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
											<Box marginRight={17}>
												<Box marginBottom={1}>
													<Chip
														label={"–"}
														onClick={() => {
															let shape =
																model.shape;
															let e = i + 1;
															shape[e] =
																shape[e] == 0
																	? shape[e]
																	: shape[e] -
																	  1;
															if (
																!shape[e] == 0
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
							yhat={this.state.model.yhat}
						/>
					</Box>
				</Box>
			</div>
		);
	}
}

export default App;
