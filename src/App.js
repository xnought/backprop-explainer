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
			},
			/* Stores the controls */
			controls: {
				playing: false,
				speed: 100,
			},
		};

		/* Functions Binds to This: Prototype */
		this.mutateOutput = this.mutateOutput.bind(this);
		this.mutatePlaying = this.mutatePlaying.bind(this);
		this.initializeModel = this.initializeModel.bind(this);
		this.forwardModel = this.forwardModel.bind(this);
		this.backwardModel = this.backwardModel.bind(this);
		this.updateModel = this.updateModel.bind(this);
	}

	/* 
    Name: mutateOutput
    Purpose: mutate all the values seen to user by delay of this.state.controls.speed 
    @mutate: this.state.model
  */
	async mutateOutput() {
		let count = 0;
		const timer = (ms) => new Promise((res) => setTimeout(res, ms));
		/* Until broken by user */
		while (true) {
			/* Destructure neccesary state */
			const { controls } = this.state;
			const { playing, speed } = controls;
			if (playing === false) {
				break;
			}
			await timer(speed);
			console.log(count++);
			/* Where we would do all the calculations */
		}
	}

	/* 
    Name: mutatePlaying
    Purpose: change playing to !playing, i.e true to false, or false to true
    @mutate: this.state.controls.playing 
  */
	mutatePlaying() {
		const { controls } = this.state;
		const playing = !controls.playing;
		this.setState({
			...this.state,
			controls: { ...controls, playing },
		});
	}

	initializeModel() {}
	forwardModel() {}
	backwardModel() {}
	updateModel() {}

	/* Create a function that initializes the values for the Nerual network */
	/* Create a function that constructs the or perhaps put this in a component */
	/* Create a function that performs the forward pass */
	/* Create a function that performs the backward pass */
	/* Create a function that performs the update sgd */

	render() {
		/* Destructuring */
		const { data, model, controls } = this.state;

		/* Making return less complex */
		const PlayButtonClick = (
			// eslint-disable-next-line
			<a
				onClick={async () => {
					await this.mutatePlaying();
					await this.mutateOutput();
				}}
			>
				<PlayButton playing={controls.playing} />
			</a>
		);

		/* rendered to virtual DOM */
		return (
			<div>
				<Typography variant="h2">Nice!</Typography>
				{PlayButtonClick}
			</div>
		);
	}
}

export default App;
