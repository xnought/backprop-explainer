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

		/* 
      Prototype: Functions Binds to "this" 
    */
		/* Main Logic */
		this.main = this.main.bind(this);

		/* Neural Network Logic */
		this.neuralNetwork = this.neuralNetwork.bind(this);
		/* Neural Network Implementation */
		this.initializeModel = this.initializeModel.bind(this);
		this.forwardModel = this.forwardModel.bind(this);
		this.backwardModel = this.backwardModel.bind(this);
		this.updateModel = this.updateModel.bind(this);
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

	neuralNetwork(model) {
		this.forwardModel(model);
		this.backwardModel(model);
		this.updateModel(model);
	}

	initializeModel() {}
	forwardModel(model) {}
	backwardModel(model) {}
	updateModel(model) {}

	/* 
    Name: mutate
    @param key
    @param subkey
    @param value
    @mutate: this.state.key.subkey with value
  */
	mutate(key, subkey, value) {
		let state = { ...this.state };
		state[key][subkey] = value;
		this.setState({ state });
	}

	render() {
		/* Destructuring State*/
		const { data, model, controls } = this.state;
		/* Destructuring model */
		const { epoch } = model;

		/* Making return less complex */
		const PlayButtonClick = (
			// eslint-disable-next-line
			<a
				onClick={async () => {
					await this.mutate("controls", "playing", !controls.playing);
					await this.main();
				}}
			>
				<PlayButton playing={controls.playing} />
			</a>
		);

		/* rendered to virtual DOM */
		return (
			<div>
				<Typography variant="h3">Epoch: {epoch}</Typography>
				{PlayButtonClick}
			</div>
		);
	}
}

export default App;
