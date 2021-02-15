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
			},
			/* Stores the controls */
			controls: {
				playing: false,
			},
		};

		/* Functions Binds to This: Prototype */
		this.mutatePlaying = this.mutatePlaying.bind(this);
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
			<a onClick={this.mutatePlaying}>
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
